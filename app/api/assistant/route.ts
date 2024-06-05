import { ElevenLabsClient } from "elevenlabs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const eleven = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

async function* nodeStreamToIterator(stream: NodeJS.ReadableStream): AsyncGenerator<any, void, unknown> {
  for await (const chunk of stream) {
    yield chunk;
  }
}

function iteratorToStream(iterator: AsyncGenerator<any, void, unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();
  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  const runStream = openai.beta.threads.runs.stream(threadId, {
    assistant_id:
      process.env.ASSISTANT_ID ??
      (() => {
        throw new Error("ASSISTANT_ID is not set");
      })(),
  });

  const stream = await eleven.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2",
    text: `The Declaration of Independence, adopted by the Continental Congress on July 4, 1777, starts with the Preamble and is followed by the section outlining the philosophical foundations and the need for independence. Here are the first ten paragraphs, including the famous Preamble:

    Preamble: When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.
    
    We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.
    
    —That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed,
    
    —That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.
    `,
  });

  return new Response(iteratorToStream(nodeStreamToIterator(stream)));
}

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const json = await request.json();
  const params = json.message.functionCall.parameters;
  console.log(params);

  supabase.channel(params.channelID).send({
    type: "broadcast",
    event: "slide",
    payload: {
      slide: params.slide,
    },
  });

  return new Response("OK", {
    status: 200,
  });
}

export async function OPTIONS() {
  return new Response("OK", {
    status: 200,
  });
}

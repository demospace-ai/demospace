import type { AssistantStreamEvent } from "openai/resources/beta/assistants";
import type { Run } from "openai/resources/beta/threads/runs";

// Keep the legacy assistant stream wire format used by this endpoint.
export function assistantResponse(
  ids: { threadId: string; messageId: string },
  run: (forward: (events: AsyncIterable<AssistantStreamEvent>) => Promise<Run | undefined>) => Promise<void>,
): Response {
  const encoder = new TextEncoder();
  let canceled = false;
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (code: "0" | "3" | "4" | "5", data: unknown) => {
        if (!canceled) controller.enqueue(encoder.encode(`${code}:${JSON.stringify(data)}\n`));
      };

      write("5", ids);
      try {
        await run(async (events) => {
          let result: Run | undefined;
          for await (const event of events) {
            if (canceled) break;
            if (event.event === "thread.message.created") {
              write("4", {
                id: event.data.id,
                role: "assistant",
                content: [{ type: "text", text: { value: "" } }],
              });
            } else if (event.event === "thread.message.delta") {
              const part = event.data.delta.content?.[0];
              if (part?.type === "text" && part.text?.value != null) write("0", part.text.value);
            } else if (event.event === "thread.run.completed" || event.event === "thread.run.requires_action") {
              result = event.data;
            }
          }
          return result;
        });
      } catch (error) {
        write("3", error instanceof Error ? error.message : String(error));
      } finally {
        if (!canceled) controller.close();
      }
    },
    cancel() {
      canceled = true;
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { assistantResponse } from "../app/api/assistant/assistant-response.ts";

const ids = { threadId: "thread_example", messageId: "message_example" };
async function* events(...items) {
  yield* items;
}

test("keeps the legacy control, assistant and text frames across forwarded runs", async () => {
  const needsAction = { id: "run_example", status: "requires_action" };
  const completed = { id: "run_example", status: "completed" };
  const response = assistantResponse(ids, async (forward) => {
    assert.equal(await forward(events(
      { event: "thread.message.created", data: { id: "assistant_example" } },
      { event: "thread.message.delta", data: { delta: { content: [{ type: "image_file" }] } } },
      { event: "thread.message.delta", data: { delta: { content: [{ type: "text", text: { value: "hello\nworld" } }] } } },
      { event: "thread.run.requires_action", data: needsAction },
    )), needsAction);
    assert.equal(await forward(events(
      { event: "thread.run.completed", data: completed },
    )), completed);
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await response.text(),
    '5:{"threadId":"thread_example","messageId":"message_example"}\n' +
    '4:{"id":"assistant_example","role":"assistant","content":[{"type":"text","text":{"value":""}}]}\n' +
    '0:"hello\\nworld"\n');
});

test("keeps the legacy stream error frame", async () => {
  const response = assistantResponse(ids, async () => { throw new Error("sample error"); });
  assert.equal(await response.text(),
    '5:{"threadId":"thread_example","messageId":"message_example"}\n3:"sample error"\n');
});

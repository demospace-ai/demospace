"use client";

import { Button } from "@/components/button/Button";
import { LoadingSpinner } from "@/components/loading/Loading";
import { SlideDisplay } from "@/components/slides/Slide";
import { Message, useAssistant } from "ai/react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const channelId = uuid();

export const Demi: React.FC = () => {
  const [threadId, setThreadId] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sourceBuffer, setSourceBuffer] = useState<SourceBuffer>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const { messages, append, status } = useAssistant({ api: "/api/assistant" });

  useEffect(() => {
    const mediaSource = new MediaSource();
    const audio = new Audio();
    audio.src = URL.createObjectURL(mediaSource);
    setAudio(audio);

    function sourceOpen() {
      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
      setSourceBuffer(sourceBuffer);
    }

    mediaSource.addEventListener("sourceopen", sourceOpen);
  }, []);

  const startCallInline = async () => {
    setConnecting(true);
    append({ role: "system", content: "Start demo" });

    setConnecting(false);
    setConnected(true);
  };

  const endCall = () => {
    setConnected(false);
  };

  const pause = () => {
    setPaused(true);
  };

  const unpause = () => {
    setPaused(false);
  };

  // messages.forEach((message) => console.log(message.content));

  return (
    <>
      {!connected ? (
        connecting ? (
          <LoadingSpinner className="mx-auto animate-grow" />
        ) : (
          <Button className="w-40" onClick={startCallInline}>
            Start Demo
          </Button>
        )
      ) : (
        // <ActiveCallDetail
        //   assistantIsSpeaking={assistantIsSpeaking}
        //   onEndCallClick={endCall}
        //   onPauseClick={paused ? unpause : pause}
        //   paused={paused}
        // />
        <></>
      )}
      <>
        {messages.map((message: Message) => {
          switch (message.role) {
            case "user":
            case "assistant":
              return (
                <div key={message.id} className="flex flex-col items-center mb-2">
                  <p className="text-sm text-gray-500">{message.content}</p>
                </div>
              );
          }
        })}
      </>
      <SlideDisplay channelID={channelId} />
    </>
  );
};

async function addToBuffer(
  sourceBuffer: SourceBuffer,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  queue: Uint8Array[],
) {
  sourceBuffer.addEventListener(
    "updateend",
    function () {
      if (queue.length > 0) {
        sourceBuffer.appendBuffer(queue.shift()!);
      }
    },
    false,
  );

  let first = true;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (first) {
      first = false;
      sourceBuffer.appendBuffer(value!);
      continue;
    } else {
      queue.push(value!);
    }
  }
}

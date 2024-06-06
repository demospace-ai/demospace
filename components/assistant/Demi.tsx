"use client";

import { Button } from "@/components/button/Button";
import { LoadingSpinner } from "@/components/loading/Loading";
import { SlideDisplay } from "@/components/slides/Slide";
import { Message, useAssistant } from "ai/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const channelId = uuid();

export const Demi: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const { messages, append, status } = useAssistant({ api: "/api/assistant" });

  const startCallInline = async () => {
    setConnecting(true);
    append({ role: "system", content: "Start demo" });

    setConnecting(false);
    setConnected(true);
  };

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

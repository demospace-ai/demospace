"use client";

import { ActiveCallDetail } from "@/components/ActiveCallDetail";
import { Button } from "@/components/button/Button";
import { Loading } from "@/components/loading/Loading";
import { AssistantOptions } from "@/utils/vapi/config";
import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

const vapi = new Vapi("969bf530-507e-4751-8aec-07b9f8f93020");

export const Demi: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("error", (error) => {
      console.error(error);
      setConnecting(false);
    });

    // we only want this to fire on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCallInline = () => {
    setConnecting(true);
    vapi.start(AssistantOptions);
  };
  const endCall = () => {
    vapi.stop();
  };

  return (
    <>
      {!connected ? (
        <Button onClick={startCallInline}>{connecting ? <Loading className="mx-auto" light /> : "Start Demo"}</Button>
      ) : (
        <ActiveCallDetail assistantIsSpeaking={assistantIsSpeaking} onEndCallClick={endCall} />
      )}
    </>
  );
};

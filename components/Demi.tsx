"use client";

import { ActiveCallDetail } from "@/components/ActiveCallDetail";
import { Button } from "@/components/button/Button";
import { LoadingSpinner } from "@/components/loading/Loading";
import { SlideDisplay } from "@/components/slides/Slide";
import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const ASSISTANT_ID =
  process.env.NODE_ENV === "development"
    ? "e61177f1-25d3-4273-8d5e-649555b9ccb7"
    : "08d6e6dc-b5ab-4bff-86b9-5126653f56ad";
const vapi = new Vapi("969bf530-507e-4751-8aec-07b9f8f93020");
const channelId = v4();

export const Demi: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

  // TODO: Fetch from server based on URL slug
  const assistantId = ASSISTANT_ID;

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
  }, []);

  const startCallInline = () => {
    setConnecting(true);
    vapi.start(assistantId, {
      variableValues: {
        channelId: channelId,
      },
    });
  };

  const endCall = () => {
    vapi.stop();
  };

  const pause = () => {
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      audio.pause();
    });
    vapi.setMuted(true);
    setPaused(true);
    setAssistantIsSpeaking(false);
  };

  const unpause = () => {
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      audio.play();
    });
    vapi.send({
      type: "add-message",
      message: {
        role: "system",
        content: "Resume",
      },
    });
    vapi.setMuted(false);
    setPaused(false);
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
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          onEndCallClick={endCall}
          onPauseClick={paused ? unpause : pause}
          paused={paused}
        />
      )}
      <SlideDisplay channelID={channelId} />
    </>
  );
};

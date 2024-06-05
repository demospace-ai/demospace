"use client";

import { Button } from "@/components/button/Button";
import { LoadingSpinner } from "@/components/loading/Loading";
import { SlideDisplay } from "@/components/slides/Slide";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

// const ASSISTANT_ID =
//   process.env.NODE_ENV === "development"
//     ? "e61177f1-25d3-4273-8d5e-649555b9ccb7"
//     : "08d6e6dc-b5ab-4bff-86b9-5126653f56ad";
// const vapi = new Vapi("969bf530-507e-4751-8aec-07b9f8f93020");
const channelId = uuid();

export const Demi: React.FC = () => {
  const [threadId, setThreadId] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sourceBuffer, setSourceBuffer] = useState<SourceBuffer>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  // const { messages, append } = useAssistant({ api: "/api/assistant" });

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

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

  // TODO: Fetch from server based on URL slug
  // const assistantId = ASSISTANT_ID;

  // useEffect(() => {
  //   vapi.on("call-start", () => {
  //     setConnecting(false);
  //     setConnected(true);
  //   });

  //   vapi.on("call-end", () => {
  //     setConnecting(false);
  //     setConnected(false);
  //   });

  //   vapi.on("speech-start", () => {
  //     setAssistantIsSpeaking(true);
  //   });

  //   vapi.on("speech-end", () => {
  //     setAssistantIsSpeaking(false);
  //   });

  //   vapi.on("error", (error) => {
  //     console.error(error);
  //     setConnecting(false);
  //   });
  // }, []);

  // const startCallInline = () => {
  //   setConnecting(true);
  //   vapi.start(assistantId, {
  //     variableValues: {
  //       channelId: channelId,
  //     },
  //   });
  // };

  // const endCall = () => {
  //   vapi.stop();
  // };

  // const pause = () => {
  //   const audioElements = document.querySelectorAll("audio");
  //   audioElements.forEach((audio) => {
  //     audio.pause();
  //   });
  //   vapi.setMuted(true);
  //   setPaused(true);
  //   setAssistantIsSpeaking(false);
  // };

  // const unpause = () => {
  //   const audioElements = document.querySelectorAll("audio");
  //   audioElements.forEach((audio) => {
  //     audio.play();
  //   });
  //   vapi.send({
  //     type: "add-message",
  //     message: {
  //       role: "system",
  //       content: "Resume",
  //     },
  //   });
  //   vapi.setMuted(false);
  //   setPaused(false);
  // };

  const startCallInline = async () => {
    if (!sourceBuffer || !audio) {
      return;
    }

    // setConnecting(true);
    // await append({ role: "system", content: "Starting demo!" });
    // const response = await sendMessage(null, "Start demo");
    const res = await fetch("api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId: null, message: "Start demo" }),
    });

    if (!res.body) {
      return;
    }

    const reader = res.body.getReader();
    audio.play();

    var queue: Uint8Array[] = [];

    // whatever normally would have called appendBuffer(buffer) can
    // now just call queue.push(buffer) instead

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

    // for await (const chunk of response) {
    //   if (typeof chunk === "string") {
    //     const bytes = atob(chunk);
    //     const arrayBuffer = new ArrayBuffer(bytes.length);
    //     const bufferView = new Uint8Array(arrayBuffer);
    //     sourceBuffer?.appendBuffer(bufferView);
    //   } else {
    //     sourceBuffer?.appendBuffer(chunk);
    //   }
    // }

    // setConnecting(false);
    // setConnected(true);
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
        <div>hello</div>
        {/* {messages.map((message) => (
          <div key={message.id} className="flex flex-col items-center mb-2">
            <p className="text-sm text-gray-500">{message.content}</p>
          </div>
        ))} */}
      </>
      <SlideDisplay channelID={channelId} />
    </>
  );
};

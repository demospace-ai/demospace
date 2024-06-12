"use client";

import { cn } from "@/utils/classnames";
import { useEffect, useState } from "react";

type VisualizerState = "listening" | "idle" | "speaking" | "thinking";
type AccentColor = "gray" | "green" | "blue" | "red" | "yellow";
type AgentMultibandAudioVisualizerProps = {
  state: VisualizerState;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  accentColor: AccentColor;
  frequencies: Float32Array[];
  borderRadius: number;
  gap: number;
  className?: string;
};

export const AudioVisualizer = ({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  accentColor,
  frequencies,
  borderRadius,
  gap,
  className,
}: AgentMultibandAudioVisualizerProps) => {
  const summedFrequencies = frequencies.map((bandFrequencies) => {
    const sum = bandFrequencies.reduce((a, b) => a + b, 0);
    return Math.sqrt(sum / bandFrequencies.length);
  });

  const [thinkingIndex, setThinkingIndex] = useState(Math.floor(summedFrequencies.length / 2));
  const [thinkingDirection, setThinkingDirection] = useState<"left" | "right">("right");

  const { bgColor, shadowColor } = accentColorToClassNames(accentColor);
  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIndex(Math.floor(summedFrequencies.length / 2));
      return;
    }
    const timeout = setTimeout(() => {
      if (thinkingDirection === "right") {
        if (thinkingIndex === summedFrequencies.length - 1) {
          setThinkingDirection("left");
          setThinkingIndex((prev) => prev - 1);
        } else {
          setThinkingIndex((prev) => prev + 1);
        }
      } else {
        if (thinkingIndex === 0) {
          setThinkingDirection("right");
          setThinkingIndex((prev) => prev + 1);
        } else {
          setThinkingIndex((prev) => prev - 1);
        }
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection, thinkingIndex]);

  return (
    <div
      className={cn("flex flex-row items-center", className)}
      style={{
        gap: gap + "px",
      }}
    >
      {summedFrequencies.map((frequency, index) => {
        return (
          <div
            className={`${bgColor} shadow-[0_0_15px_-3px] ${shadowColor} ${state === "listening" && "animate-pulse"}`}
            key={"frequency-" + index}
            style={{
              height: minBarHeight + frequency * (maxBarHeight - minBarHeight) + "px",
              borderRadius: borderRadius + "px",
              width: barWidth + "px",
            }}
          />
        );
      })}
    </div>
  );
};

function accentColorToClassNames(accentColor: AccentColor): { bgColor: string; shadowColor: string } {
  switch (accentColor) {
    case "gray":
      return { bgColor: "bg-gray-400", shadowColor: "shadow-gray-400" };
    case "green":
      return { bgColor: "bg-green-400", shadowColor: "shadow-green-400" };
    case "blue":
      return { bgColor: "bg-blue-400", shadowColor: "shadow-blue-400" };
    case "red":
      return { bgColor: "bg-red-400", shadowColor: "shadow-red-400" };
    case "yellow":
      return { bgColor: "bg-yellow-400", shadowColor: "shadow-yellow-400" };
  }
}

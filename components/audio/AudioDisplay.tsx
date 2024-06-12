import AudioViz from "@/assets/audio-viz.svg";
import { AudioVisualizer } from "@/components/audio/Visualizer";
import { LoadingSpinner } from "@/components/loading/Loading";
import { TrackReference } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import Image from "next/image";
import React from "react";

type AudioDisplayProps = {
  roomState: ConnectionState;
  agentAudioTrack: TrackReference | undefined;
  agentMultibandVolumes: Float32Array[];
};

export const AgentAudioDisplay: React.FC<AudioDisplayProps> = ({ roomState, agentAudioTrack, agentMultibandVolumes }) => {
  let content: React.ReactNode;
  if (roomState === ConnectionState.Disconnected) {
    content = <Image src={AudioViz} alt="Audio visualizer placeholder" width={214} height={110} className="w-auto" />;
  } else if (!agentAudioTrack) {
    content = <LoadingSpinner className="animate-grow" />;
  } else {
    content = (
      <AudioVisualizer
        state="speaking"
        barWidth={30}
        minBarHeight={30}
        maxBarHeight={120}
        accentColor="blue"
        frequencies={agentMultibandVolumes}
        borderRadius={12}
        gap={16}
      />
    );
  }
  return <div className="flex flex-col items-center justify-center w-full h-[120px] min-h-[120px]">{content}</div>;
};

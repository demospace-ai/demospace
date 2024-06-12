"use client";

import { MutedMicrophoneIcon } from "@/assets/Icons";
import NameAndLogo from "@/assets/name-and-logo.svg";
import OtterDemo from "@/assets/otter-demo.png";
import { TranscriptionDisplay } from "@/components/assistant/TranscriptionDisplay";
import { ChatMessageType } from "@/components/assistant/types";
import { ConnectionProvider, useConnection } from "@/components/assistant/useConnection";
import { AgentAudioDisplay } from "@/components/audio/AudioDisplay";
import { AudioVisualizer } from "@/components/audio/Visualizer";
import { useMultibandTrackVolume } from "@/components/audio/useTrackVolume";
import { Button } from "@/components/button/Button";
import { cn } from "@/utils/classnames";
import { MicrophoneIcon, RocketLaunchIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AgentRoom() {
  return (
    <div className="flex flex-col items-center justify-center">
      <ConnectionProvider>
        <AgentRoomInner />
      </ConnectionProvider>
    </div>
  );
}

function AgentRoomInner() {
  const { wsUrl, token, shouldConnect } = useConnection();
  return (
    <LiveKitRoom
      className="flex flex-col h-full w-full justify-center items-center"
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      connectOptions={{ autoSubscribe: true }}
    >
      <RoomAudioRenderer />
      <RoomInteractionDisplay />
    </LiveKitRoom>
  );
}

const PoweredByDemospace = () => {
  return (
    <div className="absolute -bottom-7 right-0 flex gap-2 mt-1">
      <span className="text-gray-500 text-sm">Powered by</span>
      <Image src={NameAndLogo} width={101} height={14} alt="Demospace Logo" />
    </div>
  );
};

function RoomInteractionDisplay() {
  const [overlay, setOverlay] = useState<boolean>(true);
  const { connect, disconnect } = useConnection();
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();
  const [assetSrc, setAssetSrc] = useState<string>(OtterDemo.src);

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const toggleMute = useCallback(
    (muted: boolean) => {
      localParticipant.setMicrophoneEnabled(!muted);
    },
    [localParticipant],
  );

  const agentAudioTrackRef = useMemo(() => {
    return tracks.find((trackRef) => trackRef.publication.kind === Track.Kind.Audio && trackRef.participant.isAgent);
  }, [tracks]);
  const agentAudioTrack = useMemo(() => agentAudioTrackRef?.publication.track, [agentAudioTrackRef]);
  const agentMultibandVolumes = useMultibandTrackVolume(agentAudioTrack, overlay ? 5 : 10);

  const localMicTrackRef = useMemo(() => {
    const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
    return localTracks.find(({ source }) => source === Track.Source.Microphone);
  }, [tracks]);
  const localMicTrack = useMemo(() => localMicTrackRef?.publication.track, [localMicTrackRef]);
  const localMultibandVolumes = useMultibandTrackVolume(localMicTrack, 16);

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(new TextDecoder("utf-8").decode(msg.payload));
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      } else if (msg.topic === "asset") {
        console.log("slide", msg.payload);
        const decoded = JSON.parse(new TextDecoder("utf-8").decode(msg.payload));
        setAssetSrc(decoded.assetUrl);
        setOverlay(false);
      }
    },
    [transcripts],
  );

  useDataChannel(onDataReceived);

  const transcriptionDisplay = useMemo(() => {
    return <TranscriptionDisplay agentAudioTrack={agentAudioTrackRef} />;
  }, [agentAudioTrackRef]);

  return (
    <div className="relative flex flex-col shadow-centered-lg bg-white border border-solid border-slate-200 rounded-lg p-6 max-w-[1000px]">
      <PoweredByDemospace />
      <h2 className="font-semibold text-lg mb-2">Otter AI Demo</h2>
      <div className="relative flex flex-col w-full h-full">
        <Image src={assetSrc} width={960} height={540} alt="Otter Demo Title Slide" className="select-none" priority />
        <div
          className={cn(
            overlay && "absolute top-0 left-0 bg-black/30",
            "flex flex-col items-center justify-center w-full h-full ",
          )}
        >
          <div
            className={cn(
              overlay ? "w-[560px] h-[360px] -mt-8 p-6" : "w-full",
              "relative flex items-center justify-center bg-white rounded-2xl",
            )}
          >
            <div className="flex flex-col items-center justify-start w-full h-full gap-2 pt-4">
              {overlay && (
                <AgentAudioDisplay
                  roomState={roomState}
                  agentAudioTrack={agentAudioTrackRef}
                  agentMultibandVolumes={agentMultibandVolumes}
                />
              )}
              {transcriptionDisplay}
              <ConnectionButton connect={connect} roomState={roomState} />
              {roomState === ConnectionState.Connected && (
                <div
                  className={cn(
                    overlay && "absolute -bottom-20 left-1/2 -translate-x-1/2",
                    "flex items-center justify-center gap-5 bg-white px-6 py-2 rounded-full transition-opacity animate-fade-in",
                  )}
                >
                  {!overlay && (
                    <>
                      <span className="text-blue-600 mb-1">Demi</span>
                      <AudioVisualizer
                        state="speaking"
                        barWidth={4}
                        minBarHeight={2}
                        maxBarHeight={40}
                        accentColor="blue"
                        frequencies={agentMultibandVolumes}
                        borderRadius={2}
                        gap={4}
                        className="h-[50px] transition-[width 1s]"
                      />
                    </>
                  )}
                  <span className="text-gray-700 mb-1">You</span>
                  <AudioVisualizer
                    state="speaking"
                    barWidth={4}
                    minBarHeight={2}
                    maxBarHeight={40}
                    accentColor="gray"
                    frequencies={localMultibandVolumes}
                    borderRadius={2}
                    gap={4}
                    className="h-[50px] transition-[width 1s]"
                  />
                  <MuteButton muted={localParticipant.isMicrophoneEnabled} toggleMute={toggleMute} />
                  <DisconnectButton disconnect={disconnect} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MuteButton: React.FC<{ muted: boolean; toggleMute: (muted: boolean) => void }> = ({ muted, toggleMute }) => {
  return (
    <Button className="bg-gray-400 rounded-full p-2 hover:bg-gray-700" onClick={() => toggleMute(muted)}>
      {muted ? <MutedMicrophoneIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
    </Button>
  );
};

const DisconnectButton: React.FC<{ disconnect: () => void }> = ({ disconnect }) => {
  return (
    <Button className="bg-red-500 rounded-full p-2 hover:bg-red-700" onClick={disconnect}>
      <XMarkIcon className="w-5 h-5" />
    </Button>
  );
};

type ConnectionButtonProps = {
  connect: () => void;
  roomState: ConnectionState;
};

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ roomState, connect }) => {
  if (roomState !== ConnectionState.Connected) {
    return (
      <Button className="absolute bottom-10" disabled={roomState === ConnectionState.Connecting} onClick={connect}>
        Start Demo
        <RocketLaunchIcon className="w-5 h-5" />
      </Button>
    );
  }

  return <></>;
};

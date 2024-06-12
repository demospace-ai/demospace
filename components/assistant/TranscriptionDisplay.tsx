import { ChatMessageType } from "@/components/assistant/types";
import { TrackReference, useChat, useLocalParticipant, useTrackTranscription } from "@livekit/components-react";
import { LocalParticipant, Participant, Track, TranscriptionSegment } from "livekit-client";
import { useEffect, useState } from "react";

export function TranscriptionDisplay({ agentAudioTrack }: { agentAudioTrack: TrackReference | undefined }) {
  return (
    <div className="relative flex flex-col w-full max-w-full h-40 max-h-40 overflow-hidden">
      <div className="absolute w-full h-5 bg-[linear-gradient(to_bottom,white_20%,_rgba(255,_255,_255,_0.00)_100%)] pointer-events-none" />
      <div className="flex flex-col-reverse w-full overflow-scroll mb-4">
        {agentAudioTrack && <MessagesList agentAudioTrack={agentAudioTrack} />}
        <ChatMessage
          key={-1}
          name={"Demi"}
          message={
            "Click start whenever you're ready to start the demo! You'll be able chat over voice or text to ask any questions."
          }
          isSelf={false}
        />
      </div>
    </div>
  );
}

function MessagesList({ agentAudioTrack }: { agentAudioTrack: TrackReference }) {
  const agentMessages = useTrackTranscription(agentAudioTrack);
  const localParticipant = useLocalParticipant();
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [transcripts, setTranscripts] = useState<Map<string, ChatMessageType>>(new Map<string, ChatMessageType>());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const { chatMessages } = useChat();

  // store transcripts
  useEffect(() => {
    agentMessages.segments.forEach((s) =>
      transcripts.set(s.id, segmentToChatMessage(s, transcripts.get(s.id), agentAudioTrack.participant)),
    );
    localMessages.segments.forEach((s) =>
      transcripts.set(s.id, segmentToChatMessage(s, transcripts.get(s.id), localParticipant.localParticipant)),
    );

    const allMessages = Array.from(transcripts.values());
    for (const msg of chatMessages) {
      const isAgent = msg.from?.identity === agentAudioTrack.participant?.identity;
      const isSelf = msg.from?.identity === localParticipant.localParticipant.identity;
      let name = msg.from?.name;
      if (!name) {
        if (isAgent) {
          name = "Demi";
        } else if (isSelf) {
          name = "You";
        } else {
          name = "Unknown";
        }
      }
      allMessages.push({
        name,
        message: msg.message,
        timestamp: msg.timestamp,
        isSelf: isSelf,
      });
    }

    allMessages.sort((a, b) => b.timestamp - a.timestamp);
    setMessages(allMessages);
  }, [
    transcripts,
    chatMessages,
    localParticipant.localParticipant,
    agentAudioTrack.participant,
    agentMessages.segments,
    localMessages.segments,
  ]);

  return (
    <>
      {messages.map((message, index, allMsg) => {
        const hideName = index <= allMsg.length - 2 && allMsg[index + 1].name === message.name;
        return (
          <ChatMessage
            key={index}
            hideName={hideName}
            name={message.name}
            message={message.message}
            isSelf={message.isSelf}
          />
        );
      })}
    </>
  );
}

function segmentToChatMessage(
  s: TranscriptionSegment,
  existingMessage: ChatMessageType | undefined,
  participant: Participant,
): ChatMessageType {
  const msg: ChatMessageType = {
    message: s.final ? s.text : `${s.text} ...`,
    name: participant instanceof LocalParticipant ? "You" : "Demi",
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  };
  return msg;
}

type ChatMessageProps = {
  message: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

const ChatMessage = ({ name, message, isSelf, hideName }: ChatMessageProps) => {
  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-4"}`}>
      {!hideName && <div className={`${isSelf ? "text-gray-700" : "text-blue-600"} uppercase text-xs`}>{name}</div>}
      <div
        className={`pr-4 ${isSelf ? "text-gray-700" : "text-blue-500"} text-sm ${
          isSelf ? "" : "drop-shadow-blue"
        } whitespace-pre-line`}
      >
        {message}
      </div>
    </div>
  );
};

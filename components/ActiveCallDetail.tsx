import { MutedMicrophoneIcon } from "@/assets/Icons";
import { InputAudioVisualizer, OutputAudioVisualizer } from "@/components/audio/Visualizer";
import { Button } from "@/components/button/Button";
import { MicrophoneIcon, PauseIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

export const ActiveCallDetail: React.FC<{
  assistantIsSpeaking: boolean;
  onEndCallClick: () => void;
  onPauseClick: () => void;
  paused: boolean;
}> = ({ assistantIsSpeaking, onEndCallClick, onPauseClick, paused }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 border border-solid border-[#ddd] rounded-3xl shadow-md w-96 h-48">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
      </div>
      <div className="flex mt-8 gap-12 justify-center">
        <Button className="rounded-full bg-gray-400 p-3" onClick={onPauseClick}>
          {paused ? <PlayIcon className="h-8" /> : <PauseIcon className="h-8" />}
        </Button>
        <Button className="rounded-full bg-red-500 p-3" onClick={onEndCallClick}>
          <XMarkIcon className="h-8" />
        </Button>
      </div>
      <div className="flex items-center justify-center mt-4 mr-3">
        {paused ? <MutedMicrophoneIcon className="h-8 mr-1" /> : <MicrophoneIcon className="h-8 mr-1" />}
        <InputAudioVisualizer paused={paused} />
      </div>
    </div>
  );
};

const AssistantSpeechIndicator: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  return (
    <div className="flex flex-col items-center mb-2">
      <OutputAudioVisualizer isSpeaking={isSpeaking} />
    </div>
  );
};

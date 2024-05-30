import { Button } from "@/components/button/Button";
import { cn } from "@/utils/classnames";

export const ActiveCallDetail: React.FC<{
  assistantIsSpeaking: boolean;
  onEndCallClick: () => void;
}> = ({ assistantIsSpeaking, onEndCallClick }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 border border-solid border-[#ddd] rounded-lg shadow-md w-96 h-48">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
      </div>
      <div className="mt-5 text-center">
        <Button onClick={onEndCallClick}>End Call </Button>
      </div>
    </div>
  );
};

const AssistantSpeechIndicator: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  return (
    <div className="flex items-center mb-2">
      <div className={cn("w-5 h-5 mr-2 rounded", isSpeaking ? "bg-[#3ef07c]" : "bg-[#f03e3e]")} />
      <p className="bg-slate-50 m-0">{isSpeaking ? "Assistant speaking" : "Assistant not speaking"}</p>
    </div>
  );
};

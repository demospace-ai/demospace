import { cn } from "@/utils/classnames";
import React from "react";

export const Divider: React.FC<{ text?: string; className?: string }> = ({ text, className }) => {
  return (
    <div className={cn("flex items-center w-full", className)}>
      <div className="flex-grow border-t border-gray-300 border-dashed"></div>
      {text && <span className="mx-2 text-gray-400 text-sm">{text}</span>}
      <div className="flex-grow border-t border-gray-300 border-dashed"></div>
    </div>
  );
};

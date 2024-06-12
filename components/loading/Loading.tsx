import { cn } from "@/utils/classnames";

type LoadingProps = {
  className?: string;
  light?: boolean;
  style?: React.CSSProperties;
};

export const Loading: React.FC<LoadingProps> = (props) => {
  if (props.light) {
    return (
      <svg
        className={cn("animate-spin h-5 w-5 text-slate-100", props.className)}
        style={props.style}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  }
  return (
    <svg
      className={cn("animate-spin h-5 w-5 text-slate-900", props.className)}
      style={props.style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const DotsLoading: React.FC<LoadingProps> = (props) => {
  const dotStyle = "w-[5px] h-[5px] bg-slate-500 rounded animate-dot-flashing";
  return (
    <div className={cn("flex gap-0.5", props.className)}>
      <div className={cn(dotStyle, "[animation-delay:0s]")} />
      <div className={cn(dotStyle, "[animation-delay:0.25s]")} />
      <div className={cn(dotStyle, "[animation-delay:0.5s]")} />
    </div>
  );
};

export const LoadingSpinner: React.FC<LoadingProps> = (props) => {
  return (
    <div {...props}>
      <div
        className="relative w-32 h-32 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 135deg at 50% 50%, white 0deg, rgb(59 130 246) 360deg)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[42px] h-[42px] rounded-full bg-white"></div>
        </div>
        <div className="absolute bottom-[11px] right-[14px] w-[43px] h-[43px] rounded-full bg-blue-500"></div>
      </div>
    </div>
  );
};

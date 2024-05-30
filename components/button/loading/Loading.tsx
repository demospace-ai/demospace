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
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
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

// .dot-flashing {
//   position: relative;
//   width: 10px;
//   height: 10px;
//   border-radius: 5px;
//   background-color: #9880ff;
//   color: #9880ff;
//   animation: dot-flashing 1s infinite linear alternate;
//   animation-delay: 0.5s;
// }
// .dot-flashing::before, .dot-flashing::after {
//   content: "";
//   display: inline-block;
//   position: absolute;
//   top: 0;
// }
// .dot-flashing::before {
//   left: -15px;
//   width: 10px;
//   height: 10px;
//   border-radius: 5px;
//   background-color: #9880ff;
//   color: #9880ff;
//   animation: dot-flashing 1s infinite alternate;
//   animation-delay: 0s;
// }
// .dot-flashing::after {
//   left: 15px;
//   width: 10px;
//   height: 10px;
//   border-radius: 5px;
//   background-color: #9880ff;
//   color: #9880ff;
//   animation: dot-flashing 1s infinite alternate;
//   animation-delay: 1s;
// }

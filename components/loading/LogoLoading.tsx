import LogoLoadingImage from "@/assets/logo-loading.svg";
import { cn } from "@/utils/classnames";
import Image from "next/image";

export const LogoLoading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Image
      src={LogoLoadingImage}
      width={144}
      height={144}
      className={cn(
        className,
        "select-none animate-shimmer [mask:linear-gradient(-60deg,#000_30%,#0005,#000_70%)_right/500%_100%]",
      )}
      alt="loading logo"
    />
  );
};

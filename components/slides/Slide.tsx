"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

export const SlideDisplay: React.FC<{ channelID: string }> = ({ channelID }) => {
  const [slide, setSlide] = useState<Slide>();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .channel(channelID)
      .on("broadcast", { event: "slide" }, (message) => {
        setSlide(message.payload.slide);
      })
      .subscribe((status) => {
        console.log(status);
        console.log(channelID);
      });
  }, [channelID]);

  if (!slide) {
    return null;
  }

  return (
    <div className="flex flex-1 relative max-w-screen-sm w-full max-h-[480px] h-full">
      <Image src={slide.src} alt={slide.alt} width={640} height={360} />
    </div>
  );
};

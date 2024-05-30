import { useEffect, useRef } from "react";

export const OutputAudioVisualizer: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  const barsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const animateBars = () => {
      barsRef.current.forEach((bar) => {
        if (!bar) return;
        const randomHeight = Math.floor(Math.random() * 100);
        bar.style.height = isSpeaking ? `${randomHeight}%` : "50%";
      });
      requestAnimationFrame(animateBars);
    };
    animateBars();
  }, [isSpeaking]);
  return (
    <div className="flex justify-center items-center h-40">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (barsRef.current[index] = el as HTMLDivElement)}
          className="w-12 h-1/2 bg-slate-300 mx-1 transition-all duration-100 ease-in-out rounded-full"
        />
      ))}
    </div>
  );
};

export const InputAudioVisualizer: React.FC<{ paused: boolean }> = ({ paused }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      });
    const animate = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        barsRef.current.forEach((bar, index) => {
          if (bar) {
            const data = dataArray[index];
            const height = paused ? 20 : data < 150 ? 20 : data / 4;
            bar.style.height = `${height}px`;
          }
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [paused]);

  return (
    <div className="flex items-center space-x-4 h-20">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          className="w-4 h-5 bg-blue-500 rounded-full transition-all duration-75 ease-in-out"
        />
      ))}
    </div>
  );
};

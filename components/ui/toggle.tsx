"use client";
import { useSession } from "@/context/Provider";

interface ToggleProps {
  className?: string; // Optional className prop
}

const Toggle: React.FC<ToggleProps> = () => {
  const { nightMode, setNightMode } = useSession();

  return (
    <div
      onClick={() => setNightMode(!nightMode)}
      className={`w-[10%] h-[10%] absolute left-8 bottom-5 cursor-pointer rounded-full p-1 transition-all duration-300 ${
        nightMode ? "bg-night-mode-toggle" : "bg-day-mode-toggle"
      }`}
    >
    </div>
  );
};

export default Toggle;

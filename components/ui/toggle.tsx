"use client";
import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";

interface ToggleProps {
  className?: string; // Optional className prop
}

const Toggle: React.FC<ToggleProps> = () => {
  const { settings: { nightMode }, updateSettings } = useSettings();

  const toggleNightMode = () => {
    updateSettings('nightMode', !nightMode);
  };

  return (
    <>
      <Image
        alt="Toggle Icon"
        src={
          nightMode
            ? "/icons/night-mode-toggle.png"
            : "/icons/day-mode-toggle.png"
        }
        onClick={toggleNightMode}
        className="absolute left-8 bottom-5 cursor-pointer rounded-full p-1 transition-all duration-300 
             w-20 h-auto sm:w-24 md:w-28"
        width={0} // Prevent Next.js warning
        height={0}
        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
      />
    </>
  );
};

export default Toggle;

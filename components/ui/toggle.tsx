"use client";
import { useSession } from "@/context/Provider";
import Image from "next/image";

interface ToggleProps {
  className?: string; // Optional className prop
}

const Toggle: React.FC<ToggleProps> = () => {
  const { nightMode, setNightMode } = useSession();

  return (
    <>
      <Image
        alt="Toggle Icon"
        src={nightMode ? "/icons/night-mode-toggle.png" : "/icons/day-mode-toggle.png"}
        onClick={() => setNightMode(!nightMode)}
        className="absolute left-8 bottom-5 cursor-pointer rounded-full p-1 transition-all duration-300"
        width={105}
        height={53}
      />
    </>
  );
};

export default Toggle;

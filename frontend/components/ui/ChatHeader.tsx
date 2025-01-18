import React from "react";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import { useSession } from "@/context/Provider";

const quicksand = Quicksand({ subsets: ["latin"] });

const ChatHeader = () => {
  const { selectedPersona } = useSession();

  return (
    <div className="flex flex-row justify-between top-0 left-0 text-xl py-5 px-12 bg-[#010f17]/40 drop-shadow-md">
      {/* Chatbot Persona */}
      <div className="justify-start items-center gap-[25px] inline-flex">
        {/* <Image
          src="/icons/bars-solid.svg"
          alt="Hamburger icon"
          width={24}
          height={24}
          onClick={toggleSideBar}
        /> */}
        <div className={`w-12 h-12 bg-black/20 rounded-full bg-cover ${selectedPersona == "Jenna" ? "bg-profile-pic-jenna" : "bg-profile-pic-marcus"}`}></div>
        <div
          className={`text-center text-white/80 text-xl font-semibold ${quicksand.className}`}
        >
          {selectedPersona}
        </div>
      </div>
      {/* Right side header items */}
      <div
        className={`text-[17px] flex flex-row justify-between items-center gap-8 ${quicksand.className}`}
      >
        <div className="flex flex-row justify-center items-center gap-2">
          <span className="text-white/60">Help</span>
          {/* Need to change this to white */}
          <Image
            src="/icons/circle-info-solid.svg"
            alt="Help Icon"
            width={20}
            height={20}
            className="text-white/60"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="p-2.5 px-3 rounded-md bg-black/50">PQ</div>
          <span>Pei Qian</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

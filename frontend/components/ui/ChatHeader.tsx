import React from "react";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import { useSession } from "@/context/Provider";
import { useState } from "react";

const quicksand = Quicksand({ subsets: ["latin"] });

const ChatHeader = () => {
  const { selectedPersona, setShowSideBar, showSideBar, setSelectedPersona } =
    useSession();
  const [showPopUp, setShowPopUp] = useState(false);

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="flex flex-row justify-between top-0 left-0 text-xl py-3 px-9 bg-[#010f17]/40 drop-shadow-md">
      {/* Chatbot Persona */}
      <div className="flex flex-row gap-5 flex-center">
        {!showSideBar && (
          <Image
            src="/icons/bars-solid.svg"
            alt="Hamburger icon"
            width={24}
            height={24}
            onClick={toggleSideBar}
            className="hover:cursor-pointer"
          />
        )}
        <div className="relative">
          <div
            className="flex items-center gap-4 hover:cursor-pointer hover:bg-white/10 hover:rounded py-2 px-3"
            onClick={() => setShowPopUp(!showPopUp)}
          >
            <div
              className={`w-12 h-12 bg-black/20 rounded-full bg-cover ${
                selectedPersona === "Jenna"
                  ? "bg-profile-pic-jenna"
                  : "bg-profile-pic-marcus"
              }`}
            ></div>
            <div
              className={`text-center text-white text-xl font-semibold ${quicksand.className}`}
            >
              {selectedPersona}
            </div>
            <Image
              src="/icons/arrow_down.svg"
              alt="Dropdown arrow"
              width={20}
              height={20}
            />
          </div>

          {/* Popup Card */}
          {showPopUp && (
            <div className="absolute left-0 mt-4 w-64 bg-black/60 shadow-lg rounded-lg py-4 px-5 text-black z-10">
              <div className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  About {selectedPersona}
                </h3>
                <p
                  className="underline text-white/70 text-xs hover:cursor-pointer"
                  onClick={() =>
                    setSelectedPersona(
                      selectedPersona === "Jenna" ? "Marcus" : "Jenna"
                    )
                  }
                >
                  Switch persona
                </p>
              </div>
              <p className="text-sm text-white/50 mt-2">
                {selectedPersona === "Jenna"
                  ? "Jenna is a compassionate AI ready to support your journey."
                  : "Marcus is a friendly AI here to guide and listen to you."}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Right side header items */}
      <div
        className={`text-[17px] flex flex-row justify-between items-center gap-8 ${quicksand.className}`}
      >
        <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
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

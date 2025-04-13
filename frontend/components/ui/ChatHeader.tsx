import React from "react";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import HelpTooltip from "@/components/ui/HelpTooltip";
import { useSession } from "@/context/Provider";
import { useState, useEffect, useRef } from "react";

const quicksand = Quicksand({ subsets: ["latin"] });

const ChatHeader = () => {
  const {
    selectedPersona,
    setShowSideBar,
    showSideBar,
    setSelectedPersona,
    selectedTTS,
    setSelectedTTS,
    selectedMode,
    showHelp,
    setShowHelp,
  } = useSession();
  const [showPopUp, setShowPopUp] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopUp(false);
      }
    };

    if (showPopUp) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopUp]);

  return (
    <div className="relative flex flex-row justify-between top-0 left-0 text-xl py-3 px-9 bg-[#010f17]/40 drop-shadow-md">
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
            className={`flex items-center gap-4 hover:cursor-pointer hover:bg-white/10 rounded-xl py-2 px-3 ${showHelp ? "textbox-highlight-glow" : ""}`}
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
            <div
              ref={popupRef}
              className="absolute left-0 mt-4 w-[20rem] bg-black shadow-lg rounded-lg py-4 px-5 text-black z-[9999] pointer-events-auto"
            >
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
              {/*Voice mode selection*/}
              {(selectedMode === "text-and-voice" ||
                selectedMode === "voice-and-voice") && (
                <>
                  <div className="flex flex-row items-center justify-between mt-5">
                    <h4 className="text-sm font-normal text-white">
                      Voice mode :{" "}
                      {selectedTTS === "polly" ? "Online" : "Offline"}
                    </h4>
                    <p
                      className="underline text-white/70 text-xs hover:cursor-pointer"
                      onClick={() =>
                        setSelectedTTS(
                          selectedTTS === "polly" ? "browser" : "polly"
                        )
                      }
                    >
                      Switch mode
                    </p>
                  </div>
                  <p className="text-sm text-white/50 mt-2">
                    {selectedTTS === "polly"
                      ? "Online TTS gives realistic voices but may delay playback."
                      : "Offline TTS plays instantly but sounds robotic."}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
        {/* Help Popup Card */}
        {showHelp && (
          <HelpTooltip
            text="This is your current persona that you are talking to. You can switch the persona or voice mode here !"
            className="ml-[25rem] mt-[7rem] z-[9999]"
          />
        )}
      </div>
      {/* Right side header items */}
      <div
        className={`text-[17px] flex flex-row justify-between items-center gap-8 ${quicksand.className}`}
      >
        <div
          className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer"
          onClick={() => setShowHelp(!showHelp)}
        >
          <span className={showHelp ? "text-white font-medium z-[9999]" : "text-white/60"}>Help</span>
          <Image
            src="/icons/circle-info-solid.svg"
            alt="Help Icon"
            width={20}
            height={20}
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

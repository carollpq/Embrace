import React from "react";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import HelpTooltip from "@/components/ui/HelpTooltip";
import SliderSetting from "@/components/ui/Slider";
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
    fontSize,
    customTraits,
    setCustomTraits,
  } = useSession();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

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
    <div className="relative z-[50] flex flex-row justify-between top-0 left-0 text-xl py-3 px-9 bg-[#010f17]/40 drop-shadow-md">
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
            className={`flex items-center gap-4 hover:cursor-pointer hover:bg-white/10 rounded-xl py-2 px-3 ${
              showHelp ? "textbox-highlight-glow pointer-events-none" : ""
            }`}
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
              //ref={popupRef}
              className="absolute left-0 mt-4 w-[20rem] bg-black shadow-lg rounded-lg py-4 px-5 text-black z-[999]"
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
              <button
                onClick={() => setShowCustomize(!showCustomize)}
                className="mt-4 text-sm underline text-white/70 hover:text-white"
              >
                Customize personality
              </button>
            </div>
          )}
          {/* Customization Popup Card */}
          {showCustomize && (
            <div className="absolute left-[21rem] mt-4 w-[22rem] bg-black/90 shadow-lg rounded-lg py-4 px-5 text-white z-[999]">
              <h3 className="text-md font-semibold mb-3">
                Fine-tune {selectedPersona}
              </h3>

              {[
                "empathy",
                "warmth",
                "supportStyle",
                "energy",
                "directness",
              ].map((trait) => (
                <div key={trait} className="mb-4 text-xs">
                  <SliderSetting
                    label={trait.charAt(0).toUpperCase() + trait.slice(1)}
                    value={customTraits?.[trait] ?? 0.5}
                    onChange={(val) =>
                      setCustomTraits((prev) => ({
                        ...prev!,
                        [trait]: val,
                      }))
                    }
                    description={
                      {
                        empathy:
                          "How deeply the persona connects with your emotions.",
                        warmth: "How comforting and soothing they sound.",
                        supportStyle:
                          "Balance between emotional vs practical support.",
                        energy: "How upbeat or calm the persona feels.",
                        directness: "How direct vs gentle the tone is.",
                      }[trait as keyof typeof customTraits]
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="text-sm underline text-white/70 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Popup Card */}
        {showHelp && (
          <HelpTooltip
            text="This is your current persona that you are talking to. You can switch the persona or voice mode here !"
            className="ml-[25rem] mt-[7rem]"
          />
        )}
      </div>
      {/* Right side header items */}
      <div
        className={`${
          fontSize === "sm"
            ? "text-sm"
            : fontSize === "lg"
            ? "text-lg"
            : fontSize === "xl"
            ? "text-xl"
            : "text-base"
        } flex flex-row justify-between items-center gap-8 ${
          quicksand.className
        }`}
      >
        <div
          className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer"
          onClick={() => setShowHelp(!showHelp)}
        >
          <span
            className={
              showHelp ? "text-white font-medium z-20" : "text-white/60"
            }
          >
            Help
          </span>
          <Image
            src="/icons/circle-info-solid.svg"
            alt="Help Icon"
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

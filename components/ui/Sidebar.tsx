"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useSession } from "@/context/Provider";
import Settings from "./Settings";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import SpeechRecognition from "react-speech-recognition";
import { useRouter } from "next/navigation";
import { stopSpeech } from "@/utils/tts/polly";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Sidebar = () => {
  const {
    selectedMode,
    setSelectedMode,
    showSideBar,
    setShowSideBar,
    showHelp,
    setConfirmExitCallback,
    setShowConfirmExit,
    showSavedMessages,
    setShowSavedMessages,
  } = useSession();

  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  const toggleSideBar = () => {
    if (showSavedMessages) return;
    setShowSideBar(!showSideBar);
  };

  return (
    <div className={`relative ${showHelp ? "pointer-events-none" : ""} ${showSideBar ? "z-20" : ""}`}>
      <div
        className={`bg-[#021017]/70 w-[300px] min-w-[300px] h-screen flex flex-col drop-shadow-lg p-6 gap-10 transform transition-transform duration-300 ease-in-out ${
          showSideBar ? "translate-x-0 bg-[#021017]" : "-translate-x-full"
        }`}
      >
        {/* Hamburger icon and Logo */}
        <div className="flex flex-row w-full justify-start items-center gap-16">
          <Image
            src="/icons/bars-solid.svg"
            alt="Hamburger icon"
            width={24}
            height={24}
            className="hover:cursor-pointer"
            onClick={toggleSideBar}
          />
          <TooltipWrapper
            tooltipText="Home page"
            showTooltip={showHelp}
            placement="right"
            className="w-16 mt-[-1.5rem] text-center"
          >
            <Link
              href="#"
              onClick={(e) => {
                stopSpeech();
                e.preventDefault(); // prevent default navigation
                setConfirmExitCallback(() => () => {
                  SpeechRecognition.stopListening();
                  window.speechSynthesis.cancel();
                  router.push("/home-page");
                });
                setShowConfirmExit(true);
              }}
              className={`${
                showHelp ? "textbox-highlight-glow" : ""
              } px-3 py-1 rounded-lg ml-[-1rem]`}
            >
              <span className={`${pacifico.className} text-2xl`}>Embrace</span>
            </Link>
          </TooltipWrapper>
        </div>

        {/* Conversation mode buttons */}
        <TooltipWrapper
          tooltipText="You can switch the mode of conversation at any time here!"
          showTooltip={showHelp}
          placement="right"
          className="mt-[2rem]"
        >
          {/* Modes */}
          <div className="flex flex-col text-lg font-medium">
            <span>Conversation Modes</span>
          </div>
          <div className="flex flex-col gap-3">
            <div
              onClick={() => {
                setSelectedMode("text-and-text");
                setShowSavedMessages(false);
              }}
              className={`${
                selectedMode === "text-and-text"
                  ? "bg-white/70 text-black"
                  : "bg-black/50"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Text and text</span>
            </div>
            <div
              onClick={() => {
                setSelectedMode("text-and-voice");
                setShowSavedMessages(false);
              }}
              className={`${
                selectedMode === "text-and-voice"
                  ? "bg-white/70 text-black"
                  : "bg-black/50"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Text and voice</span>
            </div>
            <div
              onClick={() => {
                setSelectedMode("voice-and-text");
                setShowSavedMessages(false);
              }}
              className={`${
                selectedMode === "voice-and-text"
                  ? "bg-white/70 text-black"
                  : "bg-black/50"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Voice and text</span>
            </div>
            <div
              onClick={() => {
                setSelectedMode("voice-and-voice");
                setShowSavedMessages(false);
              }}
              className={`${
                selectedMode === "voice-and-voice"
                  ? "bg-white/70 text-black"
                  : "bg-black/50"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Voice and voice</span>
            </div>
          </div>
        </TooltipWrapper>

        {/* Saved messages + Settings */}
        <div className="flex flex-col gap-3">
          {/* Other section */}
          <div className="flex flex-col text-lg font-medium">
            <span>Other</span>
          </div>
          <TooltipWrapper
            tooltipText="View your previously saved messages here"
            showTooltip={showHelp}
            placement="right"
            className="mt-[-2rem]"
          >
            <div
              className={`${
                showSavedMessages ? "bg-white/70 text-black" : ""
              } bg-black/50 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
              onClick={() => setShowSavedMessages(!showSavedMessages)}
            >
              <span>Saved messages</span>
              <Image
                src="/icons/save-icon.svg"
                alt="Saved icon"
                width={18}
                height={18}
              />
            </div>
          </TooltipWrapper>

          <TooltipWrapper
            tooltipText="Set Night/Day mode, adjust font size, and toggle between high contrast"
            showTooltip={showHelp}
            placement="right"
          >
            <div
              className={`bg-black/50 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
              onClick={() => setShowSettings(!showSettings)}
            >
              <span>Settings</span>
              <Image
                src="/icons/gear-solid.svg"
                alt="Settings icon"
                width={16}
                height={16}
              />
            </div>
          </TooltipWrapper>

          {showSettings && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

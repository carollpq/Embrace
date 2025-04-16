"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useSession } from "@/context/Provider";
import Settings from "./Settings";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import SpeechRecognition from "react-speech-recognition";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Sidebar = () => {
  const {
    selectedMode,
    setSelectedMode,
    showSideBar,
    setShowSideBar,
    showHelp,
  } = useSession();

  const [showSettings, setShowSettings] = useState(false);

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className={`relative ${showHelp ? "z-20 pointer-events-none" : ""}`}>
      <div
        className={`bg-[#021017]/70 w-[300px] min-w-[300px] h-screen flex flex-col drop-shadow-lg p-6 gap-6 transform transition-transform duration-300 ease-in-out ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
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
            tooltipText="Click here to go back to home page"
            showTooltip={showHelp}
            placement="bottom"
          >
            <Link
              onClick={() => {
                SpeechRecognition.abort();
                window.speechSynthesis.cancel();
              }}
              href="/home-page"
              className={`${
                showHelp ? "textbox-highlight-glow" : ""
              } px-3 py-1 rounded-lg ml-[-1rem]`}
            >
              <span className={`${pacifico.className} text-2xl`}>Embrace</span>
            </Link>
          </TooltipWrapper>
        </div>

        {/* Modes */}
        <div className="flex flex-col text-lg font-medium">
          <span>Conversation Modes</span>
        </div>

        {/* Conversation mode buttons */}
        <TooltipWrapper
          tooltipText="You can switch the mode of conversation at any time here!"
          showTooltip={showHelp}
        >
          <div className="flex flex-col gap-3">
            <div
              onClick={() => setSelectedMode("text-and-text")}
              className={`${
                selectedMode === "text-and-text"
                  ? "bg-white/70 text-black"
                  : "bg-[#021017]/80"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Text and text</span>
            </div>
            <div
              onClick={() => setSelectedMode("text-and-voice")}
              className={`${
                selectedMode === "text-and-voice"
                  ? "bg-white/70 text-black"
                  : "bg-[#021017]/80"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Text and voice</span>
            </div>
            <div
              onClick={() => setSelectedMode("voice-and-text")}
              className={`${
                selectedMode === "voice-and-text"
                  ? "bg-white/70 text-black"
                  : "bg-[#021017]/80"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Voice and text</span>
            </div>
            <div
              onClick={() => setSelectedMode("voice-and-voice")}
              className={`${
                selectedMode === "voice-and-voice"
                  ? "bg-white/70 text-black"
                  : "bg-[#021017]/80"
              } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
            >
              <span>Voice and voice</span>
            </div>
          </div>
        </TooltipWrapper>

        {/* Other section */}
        <div className="flex flex-col text-lg font-medium">
          <span>Other</span>
        </div>

        {/* Saved messages + Settings */}
        <div className="flex flex-col gap-3">
          <TooltipWrapper
            tooltipText="View your previously saved messages here"
            showTooltip={showHelp}
          >
            <div
              className={`bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
                showHelp ? "textbox-highlight-glow" : ""
              }`}
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
            tooltipText="Customize stuff here (think of smtg better lol)"
            showTooltip={showHelp}
            placement="top"
          >
            <div
              className={`bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
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

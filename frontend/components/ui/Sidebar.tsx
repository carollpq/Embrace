"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useSession } from "@/context/Provider";
import HelpTooltip from "@/components/ui/HelpTooltip";
import Settings from "./Settings";

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
        }`} // Add transition
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
          <Link
            href="/home-page"
            className={`${
              showHelp ? "textbox-highlight-glow" : ""
            } px-3 py-1 rounded-lg ml-[-1rem]`}
          >
            <span className={`${pacifico.className} text-2xl`}>Embrace</span>
          </Link>
        </div>
        {/* Other chats section */}
        <div className="flex flex-col text-lg font-medium">
          <span>Conversation Modes</span>
        </div>
        {/* Help Popup Card */}
        {showHelp && (
          <HelpTooltip
            text="You can switch the mode of conversation at any time here!"
            className="bottom-1/2 ml-[290px]"
          />
        )}
        {/* Conversation mode container */}
        <div className="flex flex-col gap-3">
          {/* Text to text */}
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
          {/* Text to voice */}
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
          {/* Voice to text */}
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
          {/* Voice to voice */}
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

        <div className="flex flex-col text-lg font-medium">
          <span>Other</span>
        </div>
        {/* Help Popup Card */}
        {showHelp && (
          <div className="bottom-[33%] ml-[290px] z-20 absolute">
            <HelpTooltip
              text="View your previously saved messages here"
            />
            <HelpTooltip
              text="Customize stuff here (think of smtg better lol)"
              className="mt-[4.5rem]"
            />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {/* Saved chats/messages */}
          <div
            className={`bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
              showHelp ? "textbox-highlight-glow" : ""
            }`}
          >
            <span>Saved messages</span>
            <Image
              src="/icons/save-icon.svg"
              alt="Hamburger icon"
              width={18}
              height={18}
            />
          </div>
          {/* Settings button */}
          <div
            className={`bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
              showHelp ? "textbox-highlight-glow" : ""
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <span>Settings</span>
            <Image
              src="/icons/gear-solid.svg"
              alt="Hamburger icon"
              width={16}
              height={16}
            />
          </div>
          {showSettings && (<Settings />)}
        </div>
        {/* Help Popup Card */}
        {showHelp && (
          <HelpTooltip
            text="Click here to go back to home page"
            className="ml-[2rem] mt-[3rem] w-[10rem]"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

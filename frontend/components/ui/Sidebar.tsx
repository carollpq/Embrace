"use client";
import Image from "next/image";
import React from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/context/Provider";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Sidebar = () =>
  // { onLoadChat }: { onLoadChat: (threadId: string) => void }
  {
    const { selectedMode, setSelectedMode, showSideBar, setShowSideBar } = useSession();

    const toggleSideBar = () => {
      setShowSideBar(!showSideBar);
    };

    return (
      <div className="relative">
        <div
          className={`bg-[#021017]/70 w-[300px] min-w-[300px] h-screen flex flex-col drop-shadow-lg p-6 gap-6 ${
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
            <Link href="/home-page">
              <span className={`${pacifico.className} text-2xl`}>Embrace</span>
            </Link>
          </div>
          {/* Words of Affirmation section */}
          <div className="bg-[#021017] text-white py-8 px-6 pytext-center rounded-lg drop-shadow-md">
            &quot;Some words of affirmation here&quot;
          </div>
          {/* Other chats section */}
          <div className="flex flex-col text-lg font-medium">
            <span>Conversation Modes</span>
            {/* <SavedChat onLoadChat={onLoadChat} /> */}
          </div>
          {/* Conversation mode container */}
          <div className="flex flex-col gap-3">
            {/* Text to text */}
            <div onClick={() => setSelectedMode("text-and-text")} className={`${selectedMode === "text-and-text" ? "bg-white/50 text-black" : "bg-[#021017]/80"} rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer`}>
              <span>Text and text</span>
            </div>
            {/* Text to voice */}
            <div onClick={() => setSelectedMode("text-and-voice")} className={`${selectedMode === "text-and-voice" ? "bg-white/50 text-black" : "bg-[#021017]/80"} rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer`}>
              <span>Text and voice</span>
            </div>
            {/* Voice to text */}
            <div onClick={() => setSelectedMode("voice-and-text")} className={`${selectedMode === "voice-and-text" ? "bg-white/50 text-black" : "bg-[#021017]/80"} rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer`}>
              <span>Voice and text</span>
            </div>
            {/* Voice to voice */}
            <div onClick={() => setSelectedMode("voice-and-voice")} className={`${selectedMode === "voice-and-voice" ? "bg-white/50 text-black" : "bg-[#021017]/80"} rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer`}>
              <span>Voice and voice</span>
            </div>
          </div>

          <div className="flex flex-col text-lg font-medium">
            <span>Other</span>
            {/* <SavedChat onLoadChat={onLoadChat} /> */}
          </div>
          <div className="flex flex-col gap-3">
            {/* Saved chats/messages */}
            <div className="bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer">
              <span>Saved messages</span>
              <Image
                src="/icons/save-icon.svg"
                alt="Hamburger icon"
                width={18}
                height={18}
              />
            </div>
            {/* Settings button */}
            <div className="bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer">
              <span>Settings</span>
              <Image
                src="/icons/gear-solid.svg"
                alt="Hamburger icon"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Sidebar;

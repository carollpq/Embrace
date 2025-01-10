"use client";
import Image from "next/image";
import React from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Sidebar = (
 // { onLoadChat }: { onLoadChat: (threadId: string) => void }
) => {
  const [showSideBar, setShowSideBar] = useState(true);

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="relative">
      <div
        className={`bg-[#021017]/70 w-[300px] min-w-[300px] h-screen flex flex-col drop-shadow-lg p-6 gap-8 ${
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
            // onClick={toggleSideBar}
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
        <div className="flex flex-col gap-4">
          <span>Some other stuff here</span>
          {/* <SavedChat onLoadChat={onLoadChat} /> */}
        </div>
        {/* Settings button */}
        <div className="bg-[#021017]/80 rounded-lg drop-shadow-md text-left py-2 px-6 mt-20 flex flex-row justify-between items-center hover:bg-white/50 hover:text-black hover:cursor-pointer">
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
  );
};

export default Sidebar;

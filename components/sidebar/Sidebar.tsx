"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import Settings from "./Settings";
import SpeechRecognition from "react-speech-recognition";
import { useRouter } from "next/navigation";
import { stopSpeech } from "@/utils/tts/polly";
import { useSettings } from "@/context/SettingsContext";
import { useModal } from "@/context/ModalContext";
import { ModeButton } from "./ModeButton";
import { MenuItem } from "./MenuItem";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const MODES = [
  { value: "text-and-text", label: "Text and text" },
  { value: "text-and-voice", label: "Text and voice" },
  { value: "voice-and-text", label: "Voice and text" },
  { value: "voice-and-voice", label: "Voice and voice" },
];

const Sidebar = () => {
  const { settings: { nightMode, mode: selectedMode, showSideBar }, updateSettings } = useSettings();
  const { showSavedMessages, toggleSavedMessages, openExitConfirm } = useModal();
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  const toggleSideBar = () => updateSettings('showSideBar', !showSideBar);

  const handleHomeNavigation = (e: React.MouseEvent) => {
    stopSpeech();
    e.preventDefault();
    openExitConfirm(() => {
      SpeechRecognition.stopListening();
      window.speechSynthesis.cancel();
      router.push("/home-page");
    });
  };

  const handleModeChange = (mode: string) => {
    updateSettings('mode', mode);
    toggleSavedMessages(false);
  };

  return (
    <div className={`relative ${showSideBar ? "z-20" : ""}`}>
      <div
        className={`${nightMode ? "bg-[#021017]" : "bg-[#1d1629]"} w-[300px] min-w-[300px] h-screen flex flex-col drop-shadow-lg p-6 gap-10 transform transition-transform duration-300 ease-in-out ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex flex-row w-full justify-start items-center gap-16">
          <Image
            src="/icons/bars-solid.svg"
            alt="Hamburger icon"
            width={24}
            height={24}
            className="hover:cursor-pointer"
            onClick={toggleSideBar}
          />
          <Link href="#" onClick={handleHomeNavigation} className="px-3 py-1 rounded-lg ml-[-1rem]">
              <span className={`${pacifico.className} text-2xl`}>Embrace</span>
            </Link>
        </div>

        {/* Conversation Modes */}
        <div className="flex flex-col text-lg font-medium">
            <span>Conversation Modes</span>
          </div>
          <div className="flex flex-col gap-3">
            {MODES.map((mode) => (
              <ModeButton
                key={mode.value}
                mode={mode.value}
                currentMode={selectedMode}
                label={mode.label}
                onClick={handleModeChange}
              />
            ))}
          </div>

        {/* Other Menu Items */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col text-lg font-medium">
            <span>Other</span>
          </div>
          
          <MenuItem
            active={showSavedMessages}
            label="Saved messages"
            icon="/icons/save-icon.svg"
            onClick={() => toggleSavedMessages(!showSavedMessages)}
          />
          
          <MenuItem
            active={showSettings}
            label="Settings"
            icon="/icons/gear-solid.svg"
            onClick={() => setShowSettings(!showSettings)}
          >
          </MenuItem>
          {showSettings && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
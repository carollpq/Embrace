"use client"
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import Link from "next/link";
import React from "react";
import { useState } from "react";

const ModeSelection = () => {
  const [selectedMode, setSelectedMode] = useState("");

  return (
    <div className="flex flex-col h-screen relative items-center justify-center bg-home-screen-blue gap-4">
      <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000">Select Your Mode of Communication</h2>
      {/* Selection cards */}
      <div className="grid grid-cols-2 grid-rows-2 gap-8 animate-slideUp delay-1000">
        <SelectionCard
          title="Text and Text"
          description="Message with the chatbot and it will message you back!"
          svg="/img/text-and-text.png"
          onClick={() => setSelectedMode('text-and-text')}
        />
        <SelectionCard
          title="Text and Voice"
          description="Message with the chatbot and it speaks back to you!"
          svg="/img/text-and-voice.png"
          onClick={() => setSelectedMode('text-and-voice')}
        />
        <SelectionCard
          title="Voice and Text"
          description="Speak to your chatbot and it will message you back!"
          svg="/img/voice-and-text.png"
          onClick={() => setSelectedMode('voice-and-text')}
        />
        <SelectionCard
          title="Voice and Voice"
          description="Have a verbal conversatio with the chatbot!"
          svg="/img/voice-and-voice.png"
          onClick={() => setSelectedMode('voice-and-voice')}
        />
      </div>
      {/* Navigation buttons */}
      <div className="flex flex-row justify-between w-[540px] gap-8 animate-slideUp delay-1000">
        <Link href="/home" className="w-full">
          <GeneralButton className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]" text="Back"/>
        </Link>
        <Link href='/home/gender-selection' className="w-full">
          <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Continue"/>
        </Link>
      </div>
    </div>
  );
};

export default ModeSelection;

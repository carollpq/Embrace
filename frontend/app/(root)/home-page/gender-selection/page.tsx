"use client";
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import Link from "next/link";
import { useState } from "react";

const GenderSelection = () => {

  const [selectedGender, setSelectedGender] = useState("");

  return (
    <div className="flex flex-col items-center h-screen relative justify-center bg-home-screen-blue gap-[5rem]">
      <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000">
        Select Your Speaker
      </h2>
      {/* Selection cards */}
      <div className="grid grid-cols-2 gap-16 animate-slideUp delay-1000">
        <SelectionCard
          title="Say Hi to Jenn!"
          description="Message with the chatbot and it will message you back!"
          svg="/img/Jenna.png"
          onClick={() => setSelectedGender('female')}
        />
        <SelectionCard
          title="Say Hi to Marcus!"
          description="Message with the chatbot and it speaks back to you!"
          svg="/img/Marcus.png"
          onClick={() => setSelectedGender('male')}
        />
      </div>
      {/* Navigation buttons */}
      <div className="flex flex-col w-[400px] gap-2 justify-between animate-slideUp delay-1000">
        <Link href="/chatInterface">
          <GeneralButton
            className="bg-white/70 hover:bg-white/90 hover:text-black/90"
            text="Continue"
          />
        </Link>
        <Link href="/home/mode-selection">
          <GeneralButton
            className="py-[0.50rem] bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent"
            text="Back"
          />
        </Link>
      </div>
    </div>
  );
};

export default GenderSelection;

"use client";

import React from "react";
import SelectionCard from "./ui/SelectionCard";
import GeneralButton from "./ui/button";
import { useModal } from "@/context/ModalContext";

const About = () => {
  const { toggleAbout } = useModal();
  return (
    <div className="flex flex-col items-center mt-14 sm:mt-10 overflow-y-auto space-y-4 py-6">
      <h2 className="text-2xl sm:text-3xl font-medium text-white animate-slideUp delay-1000">
        About This Website
      </h2>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 animate-slideUp delay-1000">
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="A compassionate AI chat companion"
          description="This app provides a safe, non-judgmental space where you can talk about how you're feeling — anytime you need to."
          isSelected={true}
        />
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="Designed with mental well-being in mind"
          description="Our chatbot is trained to offer emotional support and thoughtful responses, tailored to your mood and preferences."
          isSelected={true}
        />
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="Built for warmth, not clinical care"
          description="This space is meant to feel like talking to a kind friend — not a therapist. It's warm, patient, and here to listen."
          isSelected={true}
        />
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="Customizable to your needs"
          description="You can choose a persona, conversation mode, and even fine-tune how the chatbot interacts with you — based on what feels most helpful."
          isSelected={true}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-row justify-between w-full gap-8 animate-slideUp delay-1000">
        <GeneralButton
          className="bg-white/70 hover:bg-white/90 hover:text-black/90"
          text="Got it"
          onClick={() => toggleAbout(false)}
        />
      </div>
    </div>
  );
};

export default About;

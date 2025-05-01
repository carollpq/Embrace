"use client";
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import React, { useState, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useOnboarding } from '@/context/OnboardingContext';

const ModeSelection = () => {
  const { settings: { nightMode }, updateSettings } = useSettings();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [loadTTSOptions, setLoadTTSOptions] = useState(false);
  const continueButtonRef = useRef<HTMLDivElement | null>(null);
  const { goNext, goBack } = useOnboarding();

  const handleCardClick = (mode: string) => {
    updateSettings('mode', mode); // Set the selected mode in your session
    setSelectedCard(mode); // Set the selected card locally

    // Scroll the continue button into view on mobile
    setTimeout(() => {
      if (window.innerWidth < 640 && continueButtonRef.current) {
        continueButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100); // slight delay ensures rendering
  };

  const checkIsSelected = () => {
    if (!selectedCard) {
      alert("Please select a mode of conversation to move onto the next page.");
    } else {
      goNext();
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-screen relative items-center justify-center px-4 py-10 sm:px-8 gap-6 overflow-y-auto ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      {!loadTTSOptions ? (
        <div className="flex flex-col items-center justify-center gap-6 absolute top-10 my-10 mx-5 sm:static sm:my-0 sm:mx-0">
          <h2 className="text-2xl font-medium text-center text-white/60 animate-slideUp delay-1000">
            Select Your Mode of Communication
          </h2>
          {/* Selection cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:gap-8 gap-4 animate-slideUp delay-1000">
            <SelectionCard
              title="Text and Text"
              description="Message with the chatbot and it will message you back!"
              svg="/img/text-and-text.png"
              onClick={() => handleCardClick("text-and-text")}
              isSelected={selectedCard === "text-and-text"}
            />
            <SelectionCard
              title="Text and Voice"
              description="Message with the chatbot and it speaks back to you!"
              svg="/img/text-and-voice.png"
              onClick={() => handleCardClick("text-and-voice")}
              isSelected={selectedCard === "text-and-voice"}
            />
            <SelectionCard
              title="Voice and Text"
              description="Speak to your chatbot and it will message you back!"
              svg="/img/voice-and-text.png"
              onClick={() => handleCardClick("voice-and-text")}
              isSelected={selectedCard === "voice-and-text"}
            />
            <SelectionCard
              title="Voice and Voice"
              description="Have a verbal conversatio with the chatbot!"
              svg="/img/voice-and-voice.png"
              onClick={() => handleCardClick("voice-and-voice")}
              isSelected={selectedCard === "voice-and-voice"}
            />
          </div>
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000 mb-10">
            <GeneralButton
              className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
              text="Back"
              onClick={goBack}
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue"
              onClick={() => {
                if (
                  selectedCard === "text-and-voice" ||
                  selectedCard === "voice-and-voice"
                ) {
                  setLoadTTSOptions(true);
                } else {
                  checkIsSelected();
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 absolute top-10 my-10 mx-5 sm:static sm:my-0 sm:mx-0">
          <h2 className="text-2xl font-medium text-white/60 animate-slideUp text-center delay-1000">
            Select Your Choice of TTS
          </h2>
          {/* Selection cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-slideUp delay-1000">
            <SelectionCard
              title="Online TTS"
              description="Great if you prefer a smoother, more natural tone and don’t mind waiting a moment."
              svg="/icons/online-icon.png"
              onClick={() => {
                updateSettings('tts', "polly");
                setSelectedCard("polly");
              }}
              isSelected={selectedCard === "polly"}
            />
            <SelectionCard
              title="Offline TTS"
              description="Great if you like faster, more interactive conversations, even if the voice is less natural."
              svg="/icons/offline-icon.png"
              onClick={() => {
                updateSettings('tts', "browser");
                setSelectedCard("browser");
              }}
              isSelected={selectedCard === "browser"}
            />
          </div>
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000 mb-10">
            <GeneralButton
              className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
              text="Back"
              onClick={() => setLoadTTSOptions(false)}
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue"
              onClick={() => {
                checkIsSelected();
              }}
              ref={continueButtonRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelection;

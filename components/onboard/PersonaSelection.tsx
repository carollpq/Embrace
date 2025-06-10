"use client";
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useOnboarding } from '@/context/OnboardingContext';

const PersonaSelection = () => {
  const router = useRouter();
  const { settings: { nightMode, persona: selectedPersona }, updateSettings } = useSettings();
  const { goNext, goBack } = useOnboarding();
  
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCustomizationChoice, setShowCustomizationChoice] = useState(false);

  const handleCardClick = (persona: string) => {
    updateSettings('persona', persona);
    setSelectedCard(persona);
    setErrorMessage("");
  };

  const handleContinue = () => {
    if (!selectedCard) {
      setErrorMessage("Please select a persona before continuing.");
    } else {
      setShowCustomizationChoice(true);
    }
  };

  const handleStartChatting = () => {
    setIsLoading(true);
    router.push("/chatInterface");
  };

  const handlePersonalize = () => {
    // Assuming customization is the next step in onboarding
    goNext();
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-screen relative items-center justify-center px-4 py-10 sm:px-8 gap-6 overflow-y-auto ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-white/70 animate-slideUp delay-1000">
            Loading Your Chat Page, Be Ready to Talk Soon!
          </h2>
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : showCustomizationChoice ? (
        <div className="flex flex-col items-center justify-center gap-8 px-4 py-10">
          <h2 className="sm:text-2xl text-xl font-medium text-white/80 animate-slideUp delay-1000 text-center">
            Would you like to personalize how {selectedPersona} supports you today?
          </h2>
          <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000">
            <GeneralButton
              className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
              text="No, start chatting"
              onClick={handleStartChatting}
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Yes, personalize"
              onClick={handlePersonalize}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 absolute top-10 my-10 mx-5 sm:static sm:my-0 sm:mx-0">
          <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000 text-center">
            Select Your Speaker
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-slideUp delay-1000">
            <SelectionCard
              title="Say Hi to Jenna!"
              description="Jenna is a warm and empathetic AI companion who helps users feel safe, heard, and gently supported."
              svg="/img/Jenna.png"
              onClick={() => handleCardClick("Jenna")}
              isSelected={selectedCard === "Jenna"}
            />
            <SelectionCard
              title="Say Hi to Marcus!"
              description="Marcus is a friendly, emotionally aware companion who listens like a caring friend—not a therapist."
              svg="/img/Marcus.png"
              onClick={() => handleCardClick("Marcus")}
              isSelected={selectedCard === "Marcus"}
            />
          </div>

          {errorMessage && <p className="text-red-800">{errorMessage}</p>}

          <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000 mb-10">
            <GeneralButton
              className="py-[0.50rem] bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent"
              text="Back"
              onClick={goBack}
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue"
              onClick={handleContinue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelection;
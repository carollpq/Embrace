"use client";
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import { useSession } from "@/context/Provider";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PersonaSelection = ({
  setLoadingPersonaSelection,
  setLoadingCustomizationSelection,
  setLoadingModeSelection,
}: {
  setLoadingPersonaSelection: (status: boolean) => void;
  setLoadingCustomizationSelection: (status: boolean) => void;
  setLoadingModeSelection: (status: boolean) => void;
}) => {
  const router = useRouter();

  const { setSelectedPersona, nightMode, selectedPersona } = useSession();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadCustomizationOption, setLoadCustomizationOption] = useState(false);

  const handleCardClick = (persona: string) => {
    setSelectedPersona(persona); // Set the selected persona in your session
    setSelectedCard(persona); // Set the selected card locally
    setErrorMessage(""); // Clear error when user selects a persona
  };

  const handleContinue = () => {
    if (!selectedCard) {
      setErrorMessage("Please select a persona before continuing.");
    } else {
      setLoadCustomizationOption(true);
    }
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
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : loadCustomizationOption ? (
        <>
          <div className="flex flex-col items-center justify-center gap-8 px-4 py-10">
            <h2 className="sm:text-2xl text-xl font-medium text-white/80 animate-slideUp delay-1000 text-center">
              Would you like to personalize how {selectedPersona} supports you
              today?
            </h2>
            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000">
              <GeneralButton
                className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
                text="No, start chatting"
                onClick={() => {
                  setIsLoading(true);
                  router.push("/chatInterface");
                }}
              />

              <GeneralButton
                className="bg-white/70 hover:bg-white/90 hover:text-black/90"
                text="Yes, personalize"
                onClick={() => {
                  setLoadingPersonaSelection(false);
                  setLoadingCustomizationSelection(true);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000 text-center">
            Select Your Speaker
          </h2>
          {/* Selection cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-slideUp delay-1000">
            <SelectionCard
              title="Say Hi to Jenn!"
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

          {/* Error Message (if user tries to continue without selection) */}
          {errorMessage && <p className="text-red-800">{errorMessage}</p>}

          <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000">
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue"
              onClick={handleContinue}
            />
            <GeneralButton
              className="py-[0.50rem] bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent"
              text="Back"
              onClick={() => {
                setLoadingPersonaSelection(false);
                setLoadingModeSelection(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaSelection;

"use client";
import GeneralButton from "@/components/ui/button";
import SelectionCard from "@/components/ui/SelectionCard";
import Link from "next/link";
import { useSession } from "@/context/Provider";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PersonaSelection = () => {
  const router = useRouter();

  const { setSelectedPersona, nightMode } = useSession();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCardClick = (persona: string) => {
    setSelectedPersona(persona); // Set the selected persona in your session
    setSelectedCard(persona); // Set the selected card locally
    setErrorMessage(""); // Clear error when user selects a persona
  };

  const handleContinue = () => {
    if (!selectedCard) {
      setErrorMessage("Please select a persona before continuing.");
    } else {
      setIsLoading(true);
      router.push("/chatInterface");
    }
  };

  return (
    <div
      className={`flex flex-col items-center h-screen relative justify-center gap-[5rem] ${
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
      ) : (
        <>
          <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000">
            Select Your Speaker
          </h2>
          {/* Selection cards */}
          <div className="grid grid-cols-2 gap-16 animate-slideUp delay-1000">
            <SelectionCard
              title="Say Hi to Jenn!"
              description="Message with the chatbot and it will message you back!"
              svg="/img/Jenna.png"
              onClick={() => handleCardClick("Jenna")}
              isSelected={selectedCard === "Jenna"}
            />
            <SelectionCard
              title="Say Hi to Marcus!"
              description="Message with the chatbot and it speaks back to you!"
              svg="/img/Marcus.png"
              onClick={() => handleCardClick("Marcus")}
              isSelected={selectedCard === "Marcus"}
            />
          </div>

          {/* Error Message (if user tries to continue without selection) */}
          {errorMessage && <p className="text-red-800">{errorMessage}</p>}

          <div className="flex flex-col w-[400px] gap-2 justify-between animate-slideUp delay-1000">
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue"
              onClick={handleContinue}
            />
            <Link href="/home-page/mode-selection">
              <GeneralButton
                className="py-[0.50rem] bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent"
                text="Back"
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaSelection;

"use client";

import { useState } from "react";
import { useSession } from "@/context/Provider";
import GeneralButton from "@/components/ui/button";

const moods = [
  { label: "Anxious", emoji: "😟" },
  { label: "Sad", emoji: "😞" },
  { label: "Angry", emoji: "😠" },
  { label: "Happy", emoji: "😊" },
  { label: "Neutral", emoji: "😐" },
  { label: "Stressed", emoji: "😐" },
];

const MoodSelection = ({
  setLoadingModeSelection,
  setLoadingMoodSelection,
}: {
  setLoadingModeSelection: (status: boolean) => void;
  setLoadingMoodSelection: (status: boolean) => void;
}) => {
  const { setSelectedMood, nightMode } = useSession();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (mood: string) => {
    setSelectedMood(mood); // Set the selected mode in your session
    setSelectedCard(mood); // Set the selected card locally
  };

  const checkIsSelected = () => {
    if (!selectedCard) {
      alert("Please select a mood to move onto the next page.");
    } else {
      setLoadingMoodSelection(false);
      setLoadingModeSelection(true);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen relative items-center justify-center gap-4 ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-white animate-slideUp delay-1000">
        <h2 className="text-3xl font-semibold">How are you feeling today?</h2>
        <p className="text-white/70 text-lg max-w-md text-center">
          Select the mood that best describes how you&apos;re feeling. This helps
          your AI companion respond in a more thoughtful and supportive way.
        </p>
        <div className="grid grid-cols-2 gap-6 mt-6">
          {moods.map(({ label, emoji }) => (
            <GeneralButton
              key={label}
              text={`${emoji} ${label}`}
              className={`text-xl hover:bg-black text-white p-6 rounded-lg h-[100px] w-[250px] ${
                selectedCard === label ? "bg-black" : "bg-black/40"
              }`}
              onClick={() => handleCardClick(label)}
            />
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex flex-row justify-between w-[540px] gap-8 animate-slideUp delay-1000 mt-6">
          <GeneralButton
            className="bg-transparent border-4 border-white/40 text-white/70 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
            text="Back"
            onClick={() => {
              setLoadingMoodSelection(false);
            }}
          />
          <GeneralButton
            className="bg-white/70 hover:bg-white/90 hover:text-black/90"
            text="Continue"
            onClick={() => {
              checkIsSelected();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodSelection;

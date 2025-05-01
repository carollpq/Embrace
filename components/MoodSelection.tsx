"use client";

import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import GeneralButton from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

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
  const { setMood } = useChat();
  const { settings: { nightMode } } = useSettings();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (mood: string) => {
    setMood(mood); // Set the selected mode in your session
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
      className={`flex flex-col h-screen w-screen relative items-center justify-center sm:gap-4 gap-2 px-6 py-10 ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-white animate-slideUp delay-1000">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">How are you feeling today?</h2>
        <p className="text-white/70 text-md sm:text-lg max-w-md text-center">
          Select the mood that best describes how you&apos;re feeling. This helps
          your AI companion respond in a more thoughtful and supportive way.
        </p>
        <div className="grid grid-cols-2 sm:gap-6 gap-4 sm:my-6 my-4 ">
          {moods.map(({ label, emoji }) => (
            <GeneralButton
              key={label}
              text={`${emoji} ${label}`}
              className={`text-xl hover:bg-black text-white p-6 rounded-lg max-h-[100px] max-w-[250px] min-h-[80px] ${
                selectedCard === label ? "bg-black" : "bg-black/40"
              }`}
              onClick={() => handleCardClick(label)}
            />
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-between w-full sm:gap-8 gap-2 animate-slideUp delay-1000">
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

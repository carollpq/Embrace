"use client";

import React, { useState, useEffect } from "react";
import SliderSetting from "@/components/ui/Slider"; // ensure default export
import GeneralButton from "@/components/ui/button";
import { jennaDefaultTraits, marcusDefaultTraits, defaultTraits, useSession } from "@/context/Provider";
import { useRouter } from "next/navigation";

const traitDescriptions = {
  empathy: "How deeply the persona connects with your emotions.",
  warmth: "The emotional tone and comfort level in responses.",
  supportStyle: "Balance between emotional vs practical support.",
  energy: "How upbeat or calm the persona feels.",
  directness: "How straightforward or gentle the responses are.",
};

const PersonaCustomization = () => {
  const { nightMode, selectedPersona, setCustomTraits } = useSession();
  // Get default traits based on selected persona
  const getDefaultTraits = () => {
    return selectedPersona === "Jenna"
      ? jennaDefaultTraits
      : marcusDefaultTraits;
  };
  const router = useRouter();
  const [traits, setTraits] = useState(getDefaultTraits);
  const [isLoading, setIsLoading] = useState(false);

  // Sync trait values when selectedPersona changes
  useEffect(() => {
    setTraits(getDefaultTraits());
  }, [selectedPersona]);

  return (
    <div
      className={`flex flex-col h-screen w-screen relative items-center justify-center gap-4 ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      {/*When user clicks 'Save and chat'*/}
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
          <div className="max-w-4xl mx-auto text-white px-20 py-7 bg-black/40 rounded-2xl shadow-xl space-y-6 animate-slideUp">
            <h2 className="text-2xl font-semibold mb-4">
              Customize Your AI Companion
            </h2>
            <p className="text-md text-white/90 mb-6">
              Adjust how your chosen persona communicates with you. This helps
              the assistant respond in a way that best supports your needs.
            </p>

            {Object.entries(traits).map(([key, value]) => (
              <SliderSetting
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onChange={(val) =>
                  setTraits((prev) => ({ ...prev, [key]: val }))
                }
                description={
                  traitDescriptions[key as keyof typeof defaultTraits]
                }
              />
            ))}

            <div className="flex justify-end gap-4 pt-6">
              <GeneralButton
                text="Reset"
                className="bg-transparent border-4 border-white/40 text-white/90 hover:text-black/70 hover:bg-white/50 hover:border-transparent py-[0.50rem]"
                onClick={() => setTraits(defaultTraits)}
              />
              <GeneralButton
                onClick={() => {
                  setCustomTraits(traits);
                  setIsLoading(true);
                  router.push("/chatInterface");
                }}
                text="Save & Start Chat"
                className="bg-white/70 hover:bg-white/90 hover:text-black"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaCustomization;

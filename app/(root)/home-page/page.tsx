"use client";

import { useSession } from "@/context/Provider";
import { useEffect, useState } from "react";
import Toggle from "@/components/ui/toggle";
import MoodSelection from "@/components/MoodSelection";
import ModeSelection from "@/components/ModeSelection";
import PersonaSelection from "@/components/PersonaSelection";
import PersonaCustomization from "@/components/PersonaCustomization";
import Disclaimer from "@/components/Disclaimer";
import About from "@/components/About";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    session,
    nightMode,
    isLoggingOut,
    confirmedExit,
    setConfirmedExit,
    showDisclaimer,
    showAbout,
  } = useSession();
  const [loadingMoodSelection, setLoadingMoodSelection] = useState(false); // Loads Mood Selection page
  const [loadingModeSelection, setLoadingModeSelection] = useState(false); // Loads Mode Selection page
  const [loadingPersonaSelection, setLoadingPersonaSelection] = useState(false); // Loads Persona Selection page
  const [loadingPersonaCustomization, setLoadingCustomizationSelection] =
    useState(false); // Loads Persona Selection page
  const router = useRouter();

  useEffect(() => {
    if (confirmedExit) setConfirmedExit(false);
  }, []);

  // Redirect to '/' if session doesn't
  useEffect(() => {
    if (session === null) {
      router.replace("/");
    }
  }, [session]);

  return (
    <div
      className={`flex flex-col justify-center items-center px-4 md:px-8 gap-10 md:gap-16 h-screen bg-center ${
        nightMode
          ? "bg-home-screen-blue"
          : "bg-home-screen-pink bg-black/20 bg-blend-overlay"
      } transition-colors duration-500 ease-in-out`}
    >
      {isLoggingOut ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-medium text-white/70 animate-slideUp delay-1000">
            Logging Out ...
          </h2>
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : showDisclaimer ? (
        <Disclaimer />
      ) : showAbout ? (
        <About />
      ) : loadingMoodSelection ? (
        <MoodSelection
          setLoadingModeSelection={setLoadingModeSelection}
          setLoadingMoodSelection={setLoadingMoodSelection}
        />
      ) : loadingModeSelection ? (
        <ModeSelection
          setLoadingModeSelection={setLoadingModeSelection}
          setLoadingPersonaSelection={setLoadingPersonaSelection}
          setLoadingMoodSelection={setLoadingMoodSelection}
        />
      ) : loadingPersonaSelection ? (
        <PersonaSelection
          setLoadingModeSelection={setLoadingModeSelection}
          setLoadingPersonaSelection={setLoadingPersonaSelection}
          setLoadingCustomizationSelection={setLoadingCustomizationSelection}
        />
      ) : loadingPersonaCustomization ? (
        <PersonaCustomization />
      ) : (
        <>
          {session && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium animate-slideUp delay-1000">
              Welcome, {session.name}
            </h2>
          )}
          <p className="sm:text-3xl text-2xl font-medium animate-slideUp delay-1000 text-white/70">
            Ready to talk?
          </p>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full justify-center items-center animate-slideUp delay-1000">
            <button
              className="text-xl md:text-2xl w-[150px] md:w-[200px] py-3 md:py-4 rounded-[20px] md:rounded-[30px] bg-white text-black/60 hover:bg-[#1d1d1d] hover:text-white button-transition drop-shadow-default"
              onClick={() => setLoadingMoodSelection(true)}
            >
              Start
            </button>
          </div>

          <Toggle />
        </>
      )}
    </div>
  );
}

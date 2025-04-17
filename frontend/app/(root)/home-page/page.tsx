"use client";

import { useSession } from "@/context/Provider";
import { useEffect, useState } from "react";
import Toggle from "@/components/ui/toggle";
import MoodSelection from "@/components/MoodSelection";
import ModeSelection from "@/components/ModeSelection";
import PersonaSelection from "@/components/PersonaSelection";
import PersonaCustomization from "@/components/PersonaCustomization";
import Disclaimer from "@/components/Disclaimer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const { session, nightMode, isLoggingOut, confirmedExit, setConfirmedExit, showDisclaimer } =
    useSession();
  const [loadingMoodSelection, setLoadingMoodSelection] = useState(false); // Loads Mood Selection page
  const [loadingModeSelection, setLoadingModeSelection] = useState(false); // Loads Mode Selection page
  const [loadingPersonaSelection, setLoadingPersonaSelection] = useState(false); // Loads Persona Selection page
  const [loadingPersonaCustomization, setLoadingCustomizationSelection] =
    useState(false); // Loads Persona Selection page
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      toast.error("Your session has expired. Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 2000); // wait 2 seconds so user can read the message
    }
  }, [session]);

  useEffect(() => {
    if (confirmedExit) setConfirmedExit(false);
  }, []);

  useEffect(() => {
    const warmUpGemini = async () => {
      try {
        const res = await fetch("/api/chatbot/init");
        const data = await res.json();
        console.log("Gemini warm-up status:", data.message || data.error);
      } catch (err) {
        console.error("Gemini warm-up error:", err);
      }
    };

    warmUpGemini(); // Fire and forget
  }, []);

  return (
    <div
      className={`flex flex-col justify-center gap-16 items-center h-screen bg-center ${
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
      ) : showDisclaimer ? (<Disclaimer />) : loadingMoodSelection ? (
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
            <h2 className="text-5xl font-medium animate-slideUp delay-1000">
              Welcome, {session.name}
            </h2>
          )}
          <p className="text-3xl font-medium animate-slideUp delay-1000 text-white/70">
            Ready to talk?
          </p>
          <div className="flex-center flex-row gap-10  w-screen animate-slideUp delay-1000">
            <button
              className="flex-center button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-2xl text-black/60 w-[200px] py-4 bg-white rounded-[30px] drop-shadow-default"
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

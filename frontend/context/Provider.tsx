"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Trait Types
export type Traits = {
  empathy: number;
  warmth: number;
  supportStyle: number;
  energy: number;
  directness: number;
};

export const defaultTraits = {
  empathy: 0.6,
  warmth: 0.6,
  supportStyle: 0.5,
  energy: 0.4,
  directness: 0.4,
};

export const jennaDefaultTraits = {
  empathy: 0.9,
  warmth: 0.85,
  supportStyle: 0.7,
  energy: 0.5,
  directness: 0.3,
};

export const marcusDefaultTraits = {
  empathy: 0.6,
  warmth: 0.65,
  supportStyle: 0.5,
  energy: 0.7,
  directness: 0.65,
};

type SessionContextType = {
  session: { name: string; email: string } | null;
  logout: () => void;
  recheckSession: () => void;
  selectedMode: string | null;
  setSelectedMode: (mode: string) => void;
  selectedPersona: string | null;
  setSelectedPersona: (persona: string) => void;
  selectedTTS: string | null;
  setSelectedTTS: (tts: string) => void;
  nightMode: boolean;
  setNightMode: (mode: boolean) => void;
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (mode: boolean) => void;
  showHelp: boolean;
  setShowHelp: (mode: boolean) => void;
  fontSize: string | null;
  setFontSize: (size: string) => void;
  highContrast: boolean | null;
  setHighContrast: (mode: boolean) => void;
  customTraits: Traits | null;
  setCustomTraits: React.Dispatch<React.SetStateAction<Traits | null>>;
  selectedMood: string | null;
  setSelectedMood: (mood: string) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);

  const [selectedMode, setSelectedMode] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("selectedMode") || "text-and-text" : "text-and-text"
  );
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("selectedPersona") || "Jenna" : "Jenna"
  );
  const [selectedTTS, setSelectedTTS] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("selectedTTS") || "polly" : "polly"
  );
  const [nightMode, setNightMode] = useState<boolean>(
    typeof window !== "undefined" ? localStorage.getItem("nightMode") === "true" : false
  );
  const [showSideBar, setShowSideBar] = useState<boolean>(
    typeof window !== "undefined" ? localStorage.getItem("showSideBar") === "true" : false
  );
  const [fontSize, setFontSize] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("fontSize") || "text-base" : "text-base"
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    typeof window !== "undefined" ? localStorage.getItem("highContrast") === "true" : false
  );
  const [customTraits, setCustomTraits] = useState<Traits | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedMood, setSelectedMood] = useState("neutral");
  const router = useRouter();

  const recheckSession = async () => {
    const res = await fetch("/api/session", { method: "GET", credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.user) setSession({ name: data.user.name, email: data.user.email });
      else setSession(null);
    } else {
      setSession(null);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    recheckSession();
  }, []);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem("selectedMode", selectedMode ?? "text-and-text");
    localStorage.setItem("selectedPersona", selectedPersona ?? "Jenna");
    localStorage.setItem("selectedTTS", selectedTTS ?? "polly");
    localStorage.setItem("nightMode", String(nightMode));
    localStorage.setItem("showSideBar", String(showSideBar));
    localStorage.setItem("fontSize", fontSize ?? "text-base");
    localStorage.setItem("highContrast", String(highContrast));
  }, [selectedMode, selectedPersona, selectedTTS, nightMode, showSideBar, fontSize, highContrast]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setSession(null);
    localStorage.clear();
    router.push("/");
  };

  if (!hasMounted) return null;

  return (
    <SessionContext.Provider
      value={{
        session,
        logout,
        recheckSession,
        selectedMode,
        setSelectedMode,
        selectedPersona,
        setSelectedPersona,
        selectedTTS,
        setSelectedTTS,
        nightMode,
        setNightMode,
        showSideBar,
        setShowSideBar,
        isLoggingOut,
        setIsLoggingOut,
        showHelp,
        setShowHelp,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        customTraits,
        setCustomTraits,
        selectedMood,
        setSelectedMood,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

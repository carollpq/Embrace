"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

type Traits = {
  empathy: number;
  warmth: number;
  supportStyle: number;
  energy: number;
  directness: number;
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

// JSX Component
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [hasMounted, setHasMounted] = useState(false);
  const [session, setSession] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(
    Cookies.get("selectedMode") || "text-and-text"
  );
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    Cookies.get("selectedPersona") || "Jenna"
  );
  const [selectedTTS, setSelectedTTS] = useState<string | null>(
    Cookies.get("selectedTTS") || "polly"
  );
  const [nightMode, setNightMode] = useState<boolean>(
    Cookies.get("nightMode") || false
  );
  const [showSideBar, setShowSideBar] = useState<boolean>(
    Cookies.get("showSideBar") || false
  );
  const [fontSize, setFontSize] = useState<string | null>(
    Cookies.get("fontSize") || "text-base"
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    Cookies.get("highContrast") || false
  );
  const [customTraits, setCustomTraits] = useState<Traits | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedMood, setSelectedMood] = useState("neutral"); 
  const router = useRouter();

  const recheckSession = async () => {
    const res = await fetch("/api/session", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        setSession({ name: data.user.name, email: data.user.email });
      } else {
        setSession(null);
      }
    } else {
      setSession(null);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    recheckSession(); // Check session on initial render
  }, []);

  // Save settings to cookies whenever they change
  useEffect(() => {
    if (selectedMode) Cookies.set("selectedMode", selectedMode, { expires: 7 });
    if (selectedPersona)
      Cookies.set("selectedPersona", selectedPersona, { expires: 7 });
    if (selectedTTS) Cookies.set("selectedTTS", selectedTTS, { expires: 7 });
    if (nightMode) Cookies.set("nightMode", nightMode, { expires: 7 });
    if (showSideBar) Cookies.set("showSideBar", showSideBar, { expires: 7 });
    if (fontSize) Cookies.set("fontSize", fontSize, { expires: 7 });
    if (highContrast) Cookies.set("highContrast", highContrast, { expires: 7 });
  }, [
    selectedMode,
    selectedPersona,
    selectedTTS,
    nightMode,
    showSideBar,
    fontSize,
    highContrast,
  ]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setSession(null);
    Cookies.remove("selectedMode");
    Cookies.remove("selectedPersona");
    Cookies.remove("selectedTTS");
    Cookies.remove("nightMode");
    Cookies.remove("showSideBar");
    Cookies.remove("highContrast");
    Cookies.remove("fontSize");
    router.push("/"); // Redirect to home page after logout
  };

  if (!hasMounted) {
    return null;
  } else {
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
  }
};

// Named function
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

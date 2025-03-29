"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
};

const SessionContext = createContext<SessionContextType | null>(null);

// JSX Component
export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedTTS, setSelectedTTS] = useState<string | null>("coqui");
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState(true);
  const router = useRouter();

  const recheckSession = async () => {
    const res = await fetch("/api/session", { method: "GET" });

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
    recheckSession(); // Check session on initial render
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setSession(null);
    router.push("/"); // Redirect to home page after logout
  };

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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Named function
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

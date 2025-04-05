"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

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
    Cookies.get("selectedMode") || null
  );
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    Cookies.get("selectedPersona") || null
  );
  const [selectedTTS, setSelectedTTS] = useState<string | null>(
    Cookies.get("selectedTTS") || "coqui"
  );
  const [nightMode, setNightMode] = useState<boolean>(
    Cookies.get("nightMode") === "true"
  );
  const [showSideBar, setShowSideBar] = useState<boolean>(
    Cookies.get("showSideBar") !== "false"
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    Cookies.set("nightMode", nightMode.toString(), { expires: 7 });
    Cookies.set("showSideBar", showSideBar.toString(), { expires: 7 });
  }, [selectedMode, selectedPersona, selectedTTS, nightMode, showSideBar]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setSession(null);
    Cookies.remove("selectedMode");
    Cookies.remove("selectedPersona");
    Cookies.remove("selectedTTS");
    Cookies.remove("nightMode");
    Cookies.remove("showSideBar");
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

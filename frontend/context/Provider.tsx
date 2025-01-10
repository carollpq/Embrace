"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SessionContextType = {
  session: { name: string; email: string } | null;
  logout: () => void;
  recheckSession: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
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
    <SessionContext.Provider value={{ session, logout, recheckSession }}>
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

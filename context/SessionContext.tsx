'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/context';

type SessionContextType = {
  user: SessionUser;
  logout: () => Promise<void>;
  recheckSession: () => Promise<void>;
  isLoggingOut: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const recheckSession = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
      });
      
      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data?.user || null);
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { 
        method: "POST", 
        credentials: "include" 
      });
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  useEffect(() => {
    recheckSession();
    const interval = setInterval(recheckSession, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SessionContext.Provider value={{ 
      user, 
      logout, 
      recheckSession, 
      isLoggingOut 
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
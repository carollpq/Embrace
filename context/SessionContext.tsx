"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/types/context";

type SessionContextType = {
  user: SessionUser;
  logout: () => Promise<void>;
  recheckSession: () => Promise<void>;
  isLoggingOut: boolean;
  error: string | null;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<SessionUser>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Verify and update current session status
   * Handles both successful and failed session checks
   */
  const recheckSession = useCallback(async () => {
    try {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Unauthorized' : 'Session check failed');
      }

      const data = await res.json();
      setUser(data?.user || null);
      setError(null);
    } catch (error) {
      console.error("Session check error:", error);
      setUser(null);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  /**
   * Logout handler with cleanup
   * - Sends logout request
   * - Clears user state
   * - Redirects to home
   */
  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setError(null);
    
    try {
      const res = await fetch("/api/logout", { 
        method: "POST", 
        credentials: "include" 
      });
      
      if (!res.ok) {
        throw new Error('Logout failed');
      }
      
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  // Initialize session and set up periodic checks
  useEffect(() => {
    recheckSession();
    
    const interval = setInterval(() => {
      if (!isLoggingOut) {
        recheckSession();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [recheckSession, isLoggingOut]);

  return (
    <SessionContext.Provider value={{ 
      user, 
      logout, 
      recheckSession, 
      isLoggingOut,
      error 
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

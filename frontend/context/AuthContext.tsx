"use client";
import { createContext, useContext, ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthContextProps {
  user: any;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const user = session?.user || null;

  const logIn = async (email: string, password: string) => {
    await signIn("credentials", { email, password });
  };

  const logOut = () => {
    signOut();
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      // Log in the user after successful sign-up
      await logIn(email, password);
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, logIn, logOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

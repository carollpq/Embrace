"use client"
import { createContext, useContext, ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthContextProps {
  user: any;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
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

  return (
    <AuthContext.Provider value={{ user, logIn, logOut }}>
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

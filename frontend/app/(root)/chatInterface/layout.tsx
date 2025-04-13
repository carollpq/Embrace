"use client";

import "../../globals.css";
import { Quicksand } from "next/font/google";
import ChatHeader from "@/components/ui/ChatHeader";
import Sidebar from "@/components/ui/Sidebar";
import { useSession } from "@/context/Provider";

const quicksand = Quicksand({ weight: ["400"], subsets: ["latin"] });

export type Message = {
  role: "user" | "model";
  content: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { nightMode, showSideBar, showHelp } = useSession();

  return (
    <main
      className={`${quicksand.className} ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      } flex flex-row h-screen w-screen justify-between`}
    >
      {showHelp && (
        <div className="absolute inset-0 bg-black/40 z-30 pointer-events-none" />
      )}
      <Sidebar />
      <div
        className={`${
          !showSideBar ? "w-screen absolute" : "w-full relative"
        } flex flex-col h-screen transition-all duration-300 ease-in-out z-40`}
      >
        <ChatHeader />
        {children}
      </div>
    </main>
  );
}

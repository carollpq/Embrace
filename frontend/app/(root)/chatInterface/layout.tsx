"use client";

import "../../globals.css";
import { Quicksand } from "next/font/google";
import ChatHeader from "@/components/ui/ChatHeader";
import Sidebar from "@/components/ui/Sidebar";
import { useSession } from "@/context/Provider";
import ExitConfirmationModal from "@/components/ui/ExitConfirmationModal";

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
  const {
    nightMode,
    showSideBar,
    showHelp,
    fontSize,
    highContrast,
    showConfirmExit,
    setShowConfirmExit,
    confirmExitCallback,
  } = useSession();

  return (
    <main
      className={`${quicksand.className} ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      } flex flex-row h-screen w-screen justify-between ${
        fontSize === "sm"
          ? "text-sm"
          : fontSize === "lg"
          ? "text-lg"
          : fontSize === "xl"
          ? "text-xl"
          : "text-base"
      } ${highContrast ? "contrast-125" : ""}`}
    >
      {showHelp && <div className="absolute inset-0 bg-black/40 z-10" />}
      <Sidebar />
      <div
        className={`${
          !showSideBar ? "w-screen absolute" : "w-full relative"
        } flex flex-col h-screen transition-all duration-300 ease-in-out z-10`}
      >
        <ChatHeader />
        {children}
      </div>
      {showConfirmExit && (
        <ExitConfirmationModal
          setShowConfirmExit={setShowConfirmExit}
          confirmExitCallback={confirmExitCallback}
        />
      )}
    </main>
  );
}

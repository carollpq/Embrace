"use client";

import "../../globals.css";
import { Quicksand } from "next/font/google";
import ChatHeader from "@/components/ui/ChatHeader";
import Sidebar from "@/components/ui/Sidebar";
import { useSession } from "@/context/Provider";
import ExitConfirmationModal from "@/components/ui/ExitConfirmationModal";
import SavedMessages from "@/components/SavedMessages";
import SessionExpiredModal from "@/components/ui/SessionExpiredModal";

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
    confirmedExit,
    showSavedMessages,
    session,
  } = useSession();

  return (
    <main
      className={`${quicksand.className} ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      } flex flex-col md:flex-row h-screen w-screen ${
        fontSize === "sm"
          ? "text-sm"
          : fontSize === "lg"
          ? "text-lg"
          : fontSize === "xl"
          ? "text-xl"
          : "text-base"
      } ${highContrast ? "contrast-125" : ""}`}
    >
      {showHelp && <div className="absolute inset-0 bg-black/60 z-10" />}
      {confirmedExit ? (
        <div className="flex flex-col items-center justify-center gap-4 w-screen h-screen">
          <h2 className="text-3xl font-medium text-white/70 animate-slideUp delay-1000">
            Exitting Chat Session ...
          </h2>
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : (
        <>
          <Sidebar />
          <div
            className={`${
              !showSideBar ? "w-screen absolute" : "sm:w-full sm:relative w-screen absolute"
            } flex flex-col h-screen transition-all duration-300 ease-in-out z-10`}
          >
            {showSavedMessages ? (
              <SavedMessages />
            ) : (
              <>
                <ChatHeader />
                {children}
              </>
            )}
          </div>
          {showConfirmExit && <ExitConfirmationModal />}
        </>
      )}
      {!session && <SessionExpiredModal />}
    </main>
  );
}

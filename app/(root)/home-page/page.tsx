// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { useModal } from "@/context/ModalContext";
import { OnboardingFlowManager } from "@/components/onboard/OnboardingFlowManager";
import Disclaimer from "@/components/home/Disclaimer";
import About from "@/components/home/About";
import { LogoutView } from "@/components/home/LogoutView";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user: session, isLoggingOut } = useSession();
  const {
    settings: { nightMode },
  } = useSettings();
  const { showDisclaimer, showAbout, confirmedExit, setConfirmedExit } =
    useModal();

  useEffect(() => {
    if (confirmedExit) setConfirmedExit(false);
  }, [confirmedExit, setConfirmedExit]);

  useEffect(() => {
    if (session === null) router.replace("/");
  }, [session, router]);

  return (
    <div
      className={`flex flex-col justify-center items-center px-4 md:px-8 gap-10 md:gap-16 h-screen bg-center ${
        nightMode
          ? "bg-home-screen-blue"
          : "bg-home-screen-pink bg-black/20 bg-blend-overlay"
      } transition-colors duration-500 ease-in-out`}
    >
      {isLoggingOut ? (
        <LogoutView />
      ) : showDisclaimer ? (
        <Disclaimer />
      ) : showAbout ? (
        <About />
      ) : (
        <OnboardingFlowManager />
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { Pacifico, Quicksand } from "next/font/google";
import Toggle from "@/components/ui/toggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { useModal } from "@/context/ModalContext";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
const quicksand = Quicksand({ weight: ["500"], subsets: ["latin"] });

export default function StartPage() {
  const { user: session } = useSession();
  const { settings: { nightMode } } = useSettings();
  const { setLoggingOut } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/home-page");
    }
  }, [session, router]);

  useEffect(() => {
    setLoggingOut(false);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center gap-10 sm:gap-16 items-center h-screen bg-center transition-colors duration-500 ease-in-out px-4 sm:px-6 md:px-12
      ${
        nightMode
          ? "bg-home-screen-blue"
          : "bg-home-screen-pink bg-black/20 bg-blend-overlay"
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-medium text-white/70 animate-slideUp delay-1000">
            Loading Authentication Page ...
          </h2>
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3" />
        </div>
      ) : (
        <>
          <h1
            className={`${pacifico.className} text-6xl sm:text-7xl md:text-8xl text-white animate-slideUp delay-1000 text-center`}
          >
            Embrace
          </h1>
          <p
            className={`${quicksand.className} text-xl md:text-2xl text-center text-white/90 animate-slideUp delay-1000 max-w-[90%]`}
          >
            Your Companion at Any Time, Anywhere
          </p>
          <div
            className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center w-full animate-slideUp delay-1000"
            onClick={() => {
              setIsLoading(true);
            }}
          >
            <Link href="/sign-in" className="sm:w-auto">
              <button className="button-transition w-[200px] py-3 sm:py-4 rounded-[30px] text-lg sm:text-2xl text-black/60 bg-white hover:bg-[#1d1d1d] hover:text-white text-center drop-shadow-default">
                Login
              </button>
            </Link>
            <Link href="/sign-up" className="sm:w-auto">
              <button className="button-transition w-[200px] py-3 sm:py-4 rounded-[30px] text-lg sm:text-2xl text-white bg-[#1d1d1d] hover:bg-white hover:text-black/60 text-center drop-shadow-default">
                Sign Up
              </button>
            </Link>
          </div>
          <div className="mt-4 sm:mt-6">
            <Toggle />
          </div>
        </>
      )}
    </div>
  );
}
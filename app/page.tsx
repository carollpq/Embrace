"use client";
import Link from "next/link";
import { Pacifico, Quicksand } from "next/font/google";
import Toggle from "@/components/ui/toggle";
import { useSession } from "@/context/Provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
const quicksand = Quicksand({ weight: ["500"], subsets: ["latin"] });

export default function StartPage() {
  const { session, nightMode, setIsLoggingOut } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    if (session) {
      router.replace("/home-page"); 
    }
  }, [session, router]);

  useEffect(() => {
    setIsLoggingOut(false);
  }, []); // Only run once

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen px-4 sm:px-6 md:px-8 gap-10 sm:gap-12 md:gap-16 bg-center transition-colors duration-500 ease-in-out ${
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
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : (
        <>
          <h1
            className={`${pacifico.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center animate-slideUp delay-1000`}
          >
            Embrace
          </h1>
          <p
            className={`${quicksand.className} text-lg sm:text-xl md:text-2xl text-center px-4 animate-slideUp delay-1000`}
          >
            Your Companion at Any Time, Anywhere
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 w-full sm:w-auto animate-slideUp delay-1000"
            onClick={() => {
              setIsLoading(true);
            }}
          >
            <Link href="/sign-in" className="w-full sm:w-auto">
              <button className="w-full sm:w-[200px] py-3 sm:py-4 text-lg sm:text-2xl bg-white text-black/60 rounded-[30px] drop-shadow-default button-transition hover:bg-[#1d1d1d] hover:text-white">
                Login
              </button>
            </Link>
            <Link href="/sign-up" className="w-full sm:w-auto">
              <button className="w-full sm:w-[200px] py-3 sm:py-4 text-lg sm:text-2xl bg-[#1d1d1d] text-white rounded-[30px] drop-shadow-default button-transition hover:bg-white hover:text-black/60">
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

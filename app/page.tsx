"use client";
import Link from "next/link";
import { Pacifico, Quicksand } from "next/font/google";
import Toggle from "@/components/ui/toggle";
import { useSession } from "@/context/Provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
const quicksand = Quicksand({ weight: ["500"], subsets: ["latin"] });

// This is the default page
export default function StartPage() {
  const { session, nightMode, setIsLoggingOut, } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  // Redirect to /home-page if session exists
  useEffect(() => {
    if (session) {
      router.replace("/home-page"); 
    }
  }, [session, router]);

  useEffect(() => {
    setIsLoggingOut(false);
  }); // Runs once when the component mounts

  return (
    <div
      className={`flex flex-col justify-center gap-16 items-center h-screen bg-center transition-colors duration-500 ease-in-out ${
        nightMode
          ? "bg-home-screen-blue"
          : "bg-home-screen-pink bg-black/20 bg-blend-overlay"
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-white/70 animate-slideUp delay-1000">
            Loading Authentication Page ...
          </h2>
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : (
        <>
          <h1
            className={`${pacifico.className} text-8xl animate-slideUp delay-1000`}
          >
            Embrace
          </h1>
          <p
            className={`${quicksand.className} text-2xl animate-slideUp delay-1000`}
          >
            Your Companion at Any Time, Anywhere
          </p>
          <div
            className="flex-center flex-row gap-10  w-screen animate-slideUp delay-1000"
            onClick={() => {
              setIsLoading(true);
            }}
          >
            <Link href="/sign-in">
              <button className="button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-2xl text-black/60 w-[200px] py-4 bg-white rounded-[30px] drop-shadow-default">
                Login
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="button-transition hover:bg-white hover:text-black/60 text-center text-white text-2xl font-normal w-[200px] py-4 bg-[#1d1d1d] rounded-[30px] drop-shadow-default">
                Sign Up
              </button>
            </Link>
          </div>
          <Toggle />
        </>
      )}
    </div>
  );
}

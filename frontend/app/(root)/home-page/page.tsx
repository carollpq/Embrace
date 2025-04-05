"use client";

import Link from "next/link";
import { useSession } from "@/context/Provider";
import { useEffect, useState } from "react";
import Toggle from "@/components/ui/toggle";

export default function Home() {
  const { session, nightMode, isLoggingOut } = useSession();
  const [loading, setLoading] = useState(false); // <-- Loading state

  useEffect(() => {
    console.log("Session on Home Page:", session); // Log session to debug
  }, [session]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center gap-16 items-center h-screen bg-center ${
        nightMode
          ? "bg-home-screen-blue"
          : "bg-home-screen-pink bg-black/20 bg-blend-overlay"
      } transition-colors duration-500 ease-in-out`}
    >
      {isLoggingOut ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-medium text-white/60 animate-slideUp delay-1000">
            Logging Out ...
          </h2>
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : (
        <>
          {session && (
            <h2 className="text-5xl font-semibold animate-slideUp delay-1000">
              Welcome, {session.name}
            </h2>
          )}
          <p className="text-3xl font-medium animate-slideUp delay-1000 text-white/70">
            Ready to talk?
          </p>
          <div className="flex-center flex-row gap-10  w-screen animate-slideUp delay-1000">
            <Link href="/home-page/mode-selection" onClick={() => setLoading(true)}>
              <button className="flex-center button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-2xl text-black/60 w-[200px] py-4 bg-white rounded-[30px] drop-shadow-default">
                {loading ?  <div className="animate-spin h-5 w-5 border-4 border-black/60 hover:border-white/60 border-t-transparent rounded-full"></div> : "Start" }
              </button>
            </Link>
          </div>
          <Toggle />
        </>
      )}
    </div>
  );
}

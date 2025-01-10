"use client";

import Link from "next/link";
import { useSession } from "@/context/Provider";
import { useEffect } from "react";

export default function Home() {

  const { session } = useSession();

  useEffect(() => {
    console.log("Session on Home Page:", session); // Log session to debug
  }, [session]);

  return (
    <div className="flex flex-col justify-center gap-16 items-center bg-home-screen-blue h-screen bg-center">
      {session && <h2
        className="text-5xl animate-slideUp delay-1000"
      >
        Welcome back, {session.name}
      </h2>}
      <p className="text-3xl animate-slideUp delay-1000 text-white/70">
        Ready to talk?
      </p>
      <div className="flex-center flex-row gap-10  w-screen animate-slideUp delay-1000">
        <Link href="/home-page/mode-selection">
          <button className="button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-2xl text-black/60 w-[200px] py-4 bg-white rounded-[30px] drop-shadow-default">
            Start
          </button>
        </Link>
      </div>
    </div>
  );
}
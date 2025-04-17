"use client";

import React from "react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useSession } from "@/context/Provider";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Navbar = () => {
  const { logout, setIsLoggingOut, isLoggingOut, setShowDisclaimer, showDisclaimer } =
    useSession();

  if (isLoggingOut) return null; // Hide navbar if logging out

  return (
    <div className="flex flex-row justify-between absolute top-0 left-0 w-screen text-xl py-8 px-14">
      {/* Logo */}
      <span className={`${pacifico.className} text-3xl`}>Embrace</span>
      {/* Right side navigation items */}
      <div className="font-md flex gap-8 text-white/60">
        <span className="hover:cursor-pointer">About</span>
        <span
          className={`hover:cursor-pointer hover:text-white ${showDisclaimer ? "text-white" : ""}`}
          onClick={() => {
            setShowDisclaimer(!showDisclaimer);
          }}
        >
          Disclaimer
        </span>
        <span
          className="hover:cursor-pointer hover:text-white"
          onClick={() => {
            setIsLoggingOut(true);
            logout();
          }}
        >
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Navbar;

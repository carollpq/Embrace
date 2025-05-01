"use client";

import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import { useSession } from "@/context/SessionContext";
import { useModal } from "@/context/ModalContext";
import { Menu, X } from "lucide-react";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Navbar = () => {
  // Session related functions
  const { logout, isLoggingOut } = useSession();
  
  // Modal related functions
  const {
    setLoggingOut,
    toggleDisclaimer,
    toggleAbout,
    showDisclaimer,
    showAbout
  } = useModal();

  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoggingOut) return null;

  return (
    <nav className="absolute top-0 left-0 w-full py-6 px-6 sm:px-14 flex items-center justify-between">
      {/* Logo */}
      <span className={`${pacifico.className} text-3xl text-white`}>Embrace</span>

      {/* Hamburger icon on mobile */}
      <div className="sm:hidden">
        {menuOpen ? (
          <X
            className="w-8 h-8 text-white cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <Menu
            className="w-8 h-8 text-white cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      {/* Links */}
      <div
        className={`flex flex-col sm:flex-row gap-6 sm:gap-8 text-white/60 text-xl font-medium transition-all duration-300 ease-in-out 
        ${menuOpen ? "absolute top-20 left-0 w-full bg-black/80 py-6 px-8 z-20" : "hidden sm:flex"}`}
      >
        <span
          className={`cursor-pointer hover:text-white ${
            showAbout ? "text-white" : ""
          }`}
          onClick={() => {
            toggleAbout();
            if (showDisclaimer) toggleDisclaimer(false);
            setMenuOpen(false);
          }}
        >
          About
        </span>
        <span
          className={`cursor-pointer hover:text-white ${
            showDisclaimer ? "text-white" : ""
          }`}
          onClick={() => {
            toggleDisclaimer();
            if (showAbout) toggleAbout(false);
            setMenuOpen(false);
          }}
        >
          Disclaimer
        </span>
        <span
          className="cursor-pointer hover:text-white"
          onClick={() => {
            setLoggingOut(true);
            logout();
            setMenuOpen(false);
          }}
        >
          Log Out
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
"use client";
import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GeneralButtonProps {
  text: string;
  onClick?: () => void; // Optional onClick prop
  className?: string; // Optional className prop
}

const GeneralButton: React.FC<GeneralButtonProps> = ({ text, onClick, className = "" }) => {
  const handleOAuthSignIn = () => {
    if (text === "Continue with Google") {
      signIn("google"); // Initiates Google OAuth sign-in
    } else if (text === "Continue with Apple") {
      signIn("apple"); // Initiates Apple OAuth sign-in
    }
  };

  return (
    <div
      onClick={onClick || handleOAuthSignIn} // Use onClick if provided, otherwise use OAuth handler
      className={`${className} flex items-center justify-center text-black/70 rounded-[50px] font-medium py-[0.75rem] px-[1.5rem] text-xl w-full drop-shadow-default text-center hover:cursor-pointer button-transition gap-4`}
    >
      {/* Conditionally render icon based on the text prop */}
      {text === "Continue with Google" && <FaGoogle size={24} />}
      {text === "Continue with Apple" && <FaApple size={26} />}
      <span>{text}</span>
    </div>
  );
};

export default GeneralButton;

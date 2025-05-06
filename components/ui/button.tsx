"use client";
import React, { forwardRef } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface GeneralButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

const GeneralButton = forwardRef<HTMLDivElement, GeneralButtonProps>(
  ({ text, onClick, className = "", isLoading = false }, ref) => {
    const handleOAuthSignIn = () => {
      if (text === "Continue with Google") {
        signIn("google");
      } else if (text === "Continue with Apple") {
        signIn("apple");
      }
    };

    return (
      <div
        ref={ref}
        onClick={!isLoading ? onClick || handleOAuthSignIn : undefined}
        className={`${className} flex items-center justify-center text-black/70 rounded-full font-medium 
                py-3 px-6 text-base sm:text-lg md:text-xl w-full drop-shadow-default 
                text-center hover:cursor-pointer button-transition gap-3 sm:gap-4`}
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-4 border-black/60 border-t-transparent rounded-full"></div>
        ) : (
          <>
            {text === "Continue with Google" && (
              <FaGoogle size={20} className="sm:size-6" />
            )}
            {text === "Continue with Apple" && (
              <FaApple size={22} className="sm:size-7" />
            )}
            <span className="text-sm sm:text-base md:text-lg">{text}</span>
          </>
        )}
      </div>
    );
  }
);

GeneralButton.displayName = "GeneralButton";

export default GeneralButton;

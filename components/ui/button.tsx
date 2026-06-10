"use client";
import { forwardRef } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";

interface GeneralButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  type?: "button" | "submit";
}

const GeneralButton = forwardRef<HTMLButtonElement, GeneralButtonProps>(
  ({ text, onClick, className = "", isLoading = false, type = "button" }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isLoading}
        className={`${className} flex items-center justify-center text-black/70 rounded-full font-medium
                py-3 px-6 text-base sm:text-lg md:text-xl w-full drop-shadow-default
                text-center hover:cursor-pointer button-transition gap-3 sm:gap-4
                disabled:cursor-not-allowed`}
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
      </button>
    );
  }
);

GeneralButton.displayName = "GeneralButton";

export default GeneralButton;

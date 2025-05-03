"use client";
import Link from "next/link";
import { Pacifico, Quicksand } from "next/font/google";
import Toggle from "@/components/ui/toggle";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { useModal } from "@/context/ModalContext";

// Font initialization
const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
const quicksand = Quicksand({ weight: ["500"], subsets: ["latin"] });

export default function StartPage() {
  // Context hooks
  const { user: session } = useSession();
  const {
    settings: { nightMode },
  } = useSettings();
  const { setLoggingOut } = useModal();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (session) {
      router.replace("/home-page");
    }
  }, [session, router]);

  // Reset logout state on mount
  useEffect(() => {
    try {
      setLoggingOut(false);
    } catch (error) {
      console.error("Failed to reset logout state:", error);
    }
  }, []);

  // Error boundary for the component
  try {
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
                try {
                  setIsLoading(true);
                } catch (error) {
                  console.error("Loading state error:", error);
                  setIsLoading(false); // Reset state on error
                }
              }}
            >
              <Link href="/sign-in" className="sm:w-auto">
                <button
                  className="button-transition w-[200px] py-3 sm:py-4 rounded-[30px] text-lg sm:text-2xl text-black/60 bg-white hover:bg-[#1d1d1d] hover:text-white text-center drop-shadow-default"
                  aria-label="Login to your account"
                >
                  Login
                </button>
              </Link>
              <Link href="/sign-up" className="sm:w-auto">
                <button
                  className="button-transition w-[200px] py-3 sm:py-4 rounded-[30px] text-lg sm:text-2xl text-white bg-[#1d1d1d] hover:bg-white hover:text-black/60 text-center drop-shadow-default"
                  aria-label="Create new account"
                >
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
  } catch (error) {
    // Component-level error handling
    console.error("StartPage render error:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }
}

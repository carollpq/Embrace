"use client";

import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/ui/AuthInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "@/utils/validation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();

  // Get session-related functions from SessionContext
  const { recheckSession } = useSession();
  // Get UI settings from SettingsContext
  const {
    settings: { nightMode },
  } = useSettings();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []); // Runs once when the component mounts

  const handleSubmit = async () => {
    try {
      if (!email || !password || !name) {
        setLoading(false);
        alert("Please enter name, email and password.");
        return;
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        setLoading(false);
        alert(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        return;
      }

      if (!isValidEmail(email)) {
        setLoading(false);
        alert("Invalid email ID.");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        recheckSession();
        router.push("/home-page");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      alert("Sign-up failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      className={`text-base md:text-lg py-12 md:py-20 flex-center flex-col gap-4 h-screen w-screen px-4 ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
      {isLoadingPage ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg md:text-2xl font-medium text-white/60 animate-slideUp delay-1000">
            Loading Authentication Page ...
          </h2>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Form section */}
          <h2 className="text-2xl md:text-3xl animate-slideUp text-white/80 mb-4">
            Create An Account
          </h2>
          <form className="text-md sm:text-lg flex flex-col items-center gap-4 w-full animate-slideUp max-w-[90vw] sm:max-w-[350px]">
            <TextInput
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Sign Up"
              isLoading={loading}
              onClick={handleSubmit}
            />
          </form>

          {/* Re-directs user to Sign In page section */}
          <p className="text-sm animate-slideUp">
            Already have an account?
            <Link
              className="font-semibold"
              href="/sign-in"
              onClick={() => setIsLoadingPage(true)}
            >
              Log In
            </Link>
          </p>

          {/* Divider section */}
          <div className="flex-center flex-row gap-8 max-w-[500px] w-full animate-slideUp">
            <hr className="border-white border-t-2 flex-grow rounded" />
            <p className="text-white">or</p>
            <hr className="border-white border-t-2 flex-grow rounded" />
          </div>

          {/* OAuth section */}
          <div className="flex-center flex-col max-w-[350px] w-full gap-4 animate-slideUp">
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue with Google"
            />
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Continue with Apple"
            />
          </div>
        </>
      )}
    </div>
  );
}

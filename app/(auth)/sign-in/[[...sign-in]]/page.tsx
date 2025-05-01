"use client";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // <-- Loading state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();

  // Get session-related functions from SessionContext
  const { recheckSession } = useSession();
  // Get UI settings from SettingsContext
  const { settings: { nightMode }} = useSettings();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []); // Runs once when the component mounts

  const handleSubmit = async () => {
    try {
      if (!email || !password) {
        setLoading(false);
        alert("Please enter both email and password.");
        return;
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(email)) {
        setLoading(false);
        alert("Invalid email ID.");
        return;
      }

      setLoading(true);

      // Send a POST request to the /api/sign-in endpoint
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        // Redirect to /home-page on successful login
        recheckSession();
        router.push("/home-page");
      } else {
        setLoading(false);
        alert(result.error || "Sign-in failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Sign-in failed.");
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
          {/* Spinning Loader */}
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
        </div>
      ) : (
        <>
          {/* Form section */}
          <h2 className="text-2xl md:text-3xl animate-slideUp text-white/80 mb-4">
            Welcome Back!
          </h2>
          <form className="text-md sm:text-lg flex flex-col items-center gap-4 w-full animate-slideUp max-w-[90vw] sm:max-w-[350px]">
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
              text="Log In"
              isLoading={loading}
              onClick={handleSubmit}
            />
          </form>

          {/* Re-directs user to Sign Up page section */}
          <p className="text-sm animate-slideUp">
            Don&apos;t have an account?
            <Link
              className="font-semibold"
              href="/sign-up"
              onClick={() => setIsLoadingPage(true)}
            >
              Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

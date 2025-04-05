"use client";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/Provider";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // <-- Loading state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();
  const { recheckSession, nightMode } = useSession();

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
    <div className={`text-2xl py-20 flex-center flex-col gap-4 h-screen w-screen ${nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"}`}>
      {isLoadingPage ? (
        <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-medium text-white/60 animate-slideUp delay-1000">
          Loading Authentication Page ...
        </h2>
        {/* Spinning Loader */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
      </div>
      ) : (
        <>
        {/* Form section */}
      <h2 className="text-3xl animate-slideUp text-white/80 mb-4">Welcome Back!</h2>
      <form
        className="flex-center flex-col max-w-[350px] gap-4 w-full animate-slideUp"
      >
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
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Log In" isLoading={loading} onClick={handleSubmit}/>
      </form>

      {/* Re-directs user to Sign Up page section */}
      <p className="text-sm animate-slideUp">
        Don't have an account?
        <Link className="font-semibold" href="/sign-up" onClick={() => setIsLoadingPage(true)}>
          Sign up
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
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Continue with Google" />
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Continue with Apple" />
      </div>
        </>
      )}
    </div>
  );
}

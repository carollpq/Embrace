"use client";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/Provider";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { recheckSession, nightMode } = useSession();

  const handleSubmit = async () => {
    try {
      
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(email)) {
        alert("Invalid email ID.");
        return;
      }

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
        alert(result.error || "Sign-in failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      alert("Sign-in failed.");
    }
  };

  return (
    <div className={`text-2xl py-20 flex-center flex-col gap-4 h-screen w-screen ${nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"}`}>
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
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Log In" onClick={handleSubmit}/>
      </form>

      {/* Re-directs user to Sign Up page section */}
      <p className="text-sm animate-slideUp">
        Don't have an account?
        <Link className="font-semibold" href="/sign-up">
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
    </div>
  );
}

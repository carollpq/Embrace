"use client";

import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/Provider";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();
  const { recheckSession, nightMode } = useSession();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []); // Runs once when the component mounts

  const handleSubmit = async () => {
    try {
      if (!email || !password || !name) {
        alert("Please enter name, email and password.");
        return;
      } else {
        console.log(`name: ${name}, email: ${email}, password: ${password}`);
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(email)) {
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

      if (response.status == 200 || response.status == 201) {
        console.log("User added successfully!");
        recheckSession();
        router.push("/home-page");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      alert("Sign-up failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      className={`text-2xl py-20 flex-center flex-col gap-4 h-screen w-screen ${
        nightMode ? "bg-home-screen-blue" : "bg-day-mode-screen-2"
      }`}
    >
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
          <h2 className="text-3xl animate-slideUp delay-1000 text-white/80 mb-4">
            Create An Account
          </h2>
          <form className="flex-center flex-col max-w-[350px] gap-4 w-full animate-slideUp">
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
            <Link className="font-semibold" href="/sign-in" onClick={() => setIsLoadingPage(true)}>
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

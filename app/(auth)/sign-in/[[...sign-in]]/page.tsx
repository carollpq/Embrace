"use client";
import { useAuth } from "@/context/AuthContext";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/TextInput";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SigninPage() {
  const { logIn } = useAuth(); // Use logIn from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      await logIn(email, password); // Use logIn from AuthContext for sign-in
      window.location.href = "/";
    } catch (error) {
      alert("Sign-in failed. Please check your credentials.");
      console.log(error);
    }
  };

  return (
    <div className="text-2xl py-20 flex-center flex-col gap-4 bg-home-screen-blue h-screen w-screen">
      {/* Form section */}
      <h2 className="text-3xl animate-slideUp">Welcome Back!</h2>
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
        <GeneralButton text="Log In" onClick={handleSubmit} />
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
        <GeneralButton text="Continue with Google" />
        <GeneralButton text="Continue with Apple" />
      </div>
    </div>
  );
}

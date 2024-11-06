"use client";
import { useAuth } from "@/context/AuthContext";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SigninPage() {
  const { signUp } = useAuth(); // Use logIn from AuthContext
  const [name, setName] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert("Please enter name, email and password.");
      return;
    }

    try {
      await signUp(name, email, password); // Use signUp from AuthContext for sign-in
      window.location.href = "/home";
    } catch (error) {
      alert("Sign-up failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="text-2xl py-20 flex-center flex-col gap-4 bg-home-screen-blue h-screen w-screen">
      {/* Form section */}
      <h2 className="text-3xl animate-slideUp delay-1000 text-white/80 mb-4">Create An Account</h2>
      <form
        className="flex-center flex-col max-w-[350px] gap-4 w-full animate-slideUp"
      >
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
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Sign Up" onClick={handleSubmit} />
      </form>

      {/* Re-directs user to Sign In page section */}
      <p className="text-sm animate-slideUp">
        Already have an account?
        <Link className="font-semibold" href="/sign-in">
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
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Continue with Google" />
        <GeneralButton className="bg-white/70 hover:bg-white/90 hover:text-black/90" text="Continue with Apple" />
      </div>
    </div>
  );
}

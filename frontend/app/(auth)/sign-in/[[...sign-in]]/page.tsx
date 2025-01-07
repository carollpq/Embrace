"use client";
import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/AuthInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
      const result = await signIn("credentials", {
         email: email, 
         password: password,
         redirect: false 
      });

      if (result.status == 200 || result.status == 201) {
        router.push("/home-page");
      } else {
        console.log(result);
        alert("Sign-in failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      alert("Sign-in failed.");
    }
  };

  return (
    <div className="text-2xl py-20 flex-center flex-col gap-4 bg-home-screen-blue h-screen w-screen">
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

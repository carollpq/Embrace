"use client";

import GeneralButton from "@/components/ui/button";
import TextInput from "@/components/ui/AuthInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { createUser, type SignUpState } from "@/actions/create-user";

const initialState: SignUpState = {
  name: '',
  email: '',
  password: '',
};

export default function SignUpPage() {
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();
  const { recheckSession } = useSession();

  const {
    settings: { nightMode },
  } = useSettings();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const [state, formAction, pending] = useActionState(createUser, initialState);

  useEffect(() => {
    if (!state.success) return;
    const run = async () => {
      await recheckSession();
      router.push("/home-page");
    }
    run();
  }, [state.success, recheckSession, router]);

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
          <form className="text-md sm:text-lg flex flex-col items-center gap-4 w-full animate-slideUp max-w-[90vw] sm:max-w-[350px]" action={formAction}>
            <TextInput
              label="Name"
              name="name"
              type="text"
              defaultValue={state.name}
              error={state.errors?.name?.[0]}
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              defaultValue={state.email}
              error={state.errors?.email?.[0]}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              error={state.errors?.password?.[0]}
            />
            {state.errors?.form?.[0] && (
              <p className="text-sm text-rose-300/90 text-center w-full">
                {state.errors.form[0]}
              </p>
            )}
            <GeneralButton
              className="bg-white/70 hover:bg-white/90 hover:text-black/90"
              text="Sign Up"
              type="submit"
              isLoading={pending}
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

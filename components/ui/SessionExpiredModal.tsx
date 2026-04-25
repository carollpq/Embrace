
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SessionExpiredModal() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/sign-in");
    }, 6000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
        <p className="text-gray-700 mb-4">
          You will be redirected to the sign-in page shortly.
        </p>
        <div className="mx-auto flex justify-center"><LoadingSpinner size="sm" /></div>
      </div>
    </div>
  );
}

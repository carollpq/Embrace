
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionExpiredModal() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/sign-in");
    }, 6000); // Redirect after 3 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
        <p className="text-gray-700 mb-4">
          You will be redirected to the sign-in page shortly.
        </p>
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

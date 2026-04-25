
'use client';

import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const LogoutView = () => (
  <div className="flex flex-col items-center gap-4">
    <h2 className="text-2xl sm:text-3xl font-medium text-white/70 animate-slideUp delay-1000">
      Logging Out ...
    </h2>
    <LoadingSpinner />
  </div>
);
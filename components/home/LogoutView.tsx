
'use client';

export const LogoutView = () => (
  <div className="flex flex-col items-center gap-4">
    <h2 className="text-2xl sm:text-3xl font-medium text-white/70 animate-slideUp delay-1000">
      Logging Out ...
    </h2>
    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
  </div>
);
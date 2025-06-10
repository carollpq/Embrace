
'use client';

import Toggle from '@/components/ui/toggle';
import { useOnboarding } from '@/context/OnboardingContext';
import { useSession } from '@/context/SessionContext';

export const HomeView = () => {
  const { startOnboarding } = useOnboarding(); 
  const { user } = useSession();

  return (
    <>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium animate-slideUp delay-1000">
        Welcome, {user && user.name}
      </h2>
      <p className="sm:text-3xl text-2xl font-medium animate-slideUp delay-1000 text-white/70">
        Ready to talk?
      </p>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full justify-center items-center animate-slideUp delay-1000">
        <button
          className="text-xl md:text-2xl w-[150px] md:w-[200px] py-3 md:py-4 rounded-[20px] md:rounded-[30px] bg-white text-black/60 hover:bg-[#1d1d1d] hover:text-white button-transition drop-shadow-default"
          onClick={startOnboarding} 
        >
          Start
        </button>
      </div>
      <Toggle />
    </>
  );
};
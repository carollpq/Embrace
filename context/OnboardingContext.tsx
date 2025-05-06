
'use client';

import { createContext, useContext, useState } from 'react';
import { ONBOARDING_STEPS } from '@/utils/onboardingSteps';

type OnboardingContextType = {
  currentStep: number;
  goNext: () => void;
  goBack: () => void;
  exitOnboarding: () => void;
  jumpToStep: (step: number) => void;
  startOnboarding: () => void;
  resetOnboarding: () => void;
  isOnboardingActive: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(-1);

  const startOnboarding = () => setCurrentStep(0);
  const resetOnboarding = () => setCurrentStep(-1);
  const exitOnboarding = () => setCurrentStep(-1);
  const goNext = () => setCurrentStep(prev => prev + 1);
  const goBack = () => setCurrentStep(prev => {
    // If at first step, exit onboarding
    return prev <= 0 ? -1 : prev - 1;
  });
  const jumpToStep = (step: number) => {
    if (step >= 0 && step < ONBOARDING_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const isOnboardingActive = currentStep >= 0;

  return (
    <OnboardingContext.Provider value={{ 
      currentStep, 
      goNext, 
      goBack, 
      jumpToStep,
      startOnboarding,
      resetOnboarding,
      isOnboardingActive,
      exitOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
};
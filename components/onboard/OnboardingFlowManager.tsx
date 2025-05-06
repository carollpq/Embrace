
'use client';

import { useOnboarding } from '@/context/OnboardingContext';
import { ONBOARDING_STEPS } from '@/utils/onboardingSteps';
import { HomeView } from '../home/HomeView';

export const OnboardingFlowManager = () => {
  const { currentStep, isOnboardingActive } = useOnboarding();
  
  if (!isOnboardingActive) {
    return <HomeView />;
  }

  if (currentStep < 0 || currentStep >= ONBOARDING_STEPS.length) {
    console.error(`Invalid onboarding step: ${currentStep}`);
    return <div className="text-white p-4">Invalid onboarding state. Please refresh.</div>;
  }

  const CurrentComponent = ONBOARDING_STEPS[currentStep].component;

  return <CurrentComponent />;
};
// utils/onboardingSteps.ts
import MoodSelection from '@/components/onboard/MoodSelection';
import ModeSelection from '@/components/onboard/ModeSelection';
import PersonaSelection from '@/components/onboard/PersonaSelection';
import PersonaCustomization from '@/components/onboard/PersonaCustomization';

export const ONBOARDING_STEPS = [
  { component: MoodSelection, name: 'mood' },
  { component: ModeSelection, name: 'mode' }, 
  { component: PersonaSelection, name: 'persona' },
  { component: PersonaCustomization, name: 'customization' }
] as const;

export type OnboardingStepName = typeof ONBOARDING_STEPS[number]['name'];
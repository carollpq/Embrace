// utils/crisisDetector.ts
const CRISIS_KEYWORDS = [
  "panic attack",
  "i want to die",
  "suicidal",
  "i want to kill myself",
  "can't breathe",
  "overwhelmed",
  "can't take it anymore",
  "help me please",
  "hurting myself",
  "self-harm",
  "ending it",
];

export function isCrisisMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
}

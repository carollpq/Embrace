export type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt?: Date;
};

export type Traits = {
  empathy: number;
  warmth: number;
  supportStyle: number;
  energy: number;
  directness: number;
};

export type SessionUser = {
  name: string;
  email: string;
} | null;

export type ChatMode = "text-and-text" | "text-and-voice" | "voice-and-text" | "voice-and-voice";
export type Persona = "Jenna" | "Marcus";
export type TTSEngine = "polly" | "browser";
export type FontSize = "sm" | "base" | "lg" | "xl";
export type Mood = "Anxious" | "Sad" | "Angry" | "Happy" | "Stressed" | "Neutral";

export type AppSettings = {
  mode: ChatMode;
  persona: Persona;
  tts: TTSEngine;
  nightMode: boolean;
  showSideBar: boolean;
  fontSize: FontSize;
  highContrast: boolean;
};

export type ChatState = {
  messages: Message[];
  input: string;
  hasUserTriggeredResponse: boolean;
  mood: Mood | "";
  customTraits: Traits | null;
};
  
  export type ModalState = {
    showHelp: boolean;
    showConfirmExit: boolean;
    confirmExitCallback: () => void;
    confirmedExit: boolean;
    showDisclaimer: boolean;
    showAbout: boolean;
    showSavedMessages: boolean;
    isLoggingOut: boolean;
  };
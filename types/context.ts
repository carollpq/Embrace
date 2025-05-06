import { Message } from "ai/react";

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
  
  export type AppSettings = {
    mode: string;
    persona: string;
    tts: string;
    nightMode: boolean;
    showSideBar: boolean;
    fontSize: string;
    highContrast: boolean;
  };
  
  export type ChatState = {
    messages: Message[];
    input: string;
    hasUserTriggeredResponse: boolean;
    mood: string;
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
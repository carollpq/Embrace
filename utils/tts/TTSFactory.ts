import { playBrowserTTS } from "./browserTTS";
import { playPersonaSpeech } from "./polly";

/**
 * Strategy interface for TTS systems
 */
export interface TTSStrategy {
  speak: (
    text: string,
    persona: string | null,
    onEnd?: () => void,
    onStart?: () => void,
    onStopLoad?: () => void,
    utteranceRef?: React.MutableRefObject<SpeechSynthesisUtterance | null>,
    audioRef?: React.MutableRefObject<HTMLAudioElement | null>
  ) => Promise<void>;
}

/**
 * AWS Polly-based TTS strategy
 */
class PollyTTS implements TTSStrategy {
  async speak(
    text: string,
    persona: string | null,
    onEnd?: () => void,
    onStart?: () => void,
    onStopLoad?: () => void,
    _utteranceRef?: React.MutableRefObject<SpeechSynthesisUtterance | null>,
    audioRef?: React.MutableRefObject<HTMLAudioElement | null>
  ): Promise<void> {
    if (!persona) {
      console.warn("PollyTTS: persona is null");
      return;
    }
    try {
      await playPersonaSpeech(text, persona, audioRef, onEnd, onStart, onStopLoad);
    } catch (error) {
      console.error("PollyTTS error:", error);
      onStopLoad?.();
    }
  }
}

/**
 * Browser-native TTS strategy (using SpeechSynthesis API)
 */
class BrowserTTS implements TTSStrategy {
  async speak(
    text: string,
    persona: string | null,
    onEnd?: () => void,
    onStart?: () => void,
    onStopLoad?: () => void,
    utteranceRef?: React.MutableRefObject<SpeechSynthesisUtterance | null>,
    _audioRef?: React.MutableRefObject<HTMLAudioElement | null>
  ): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        playBrowserTTS(
          text,
          persona,
          utteranceRef ?? { current: null },
          () => {
            onEnd?.();
            resolve();
          },
          onStart,
          onStopLoad
        );
      });
    } catch (error) {
      console.error("BrowserTTS error:", error);
      onStopLoad?.();
    }
  }
}

// Utility function to check online status
function isOnline(): boolean {
  return typeof window !== "undefined" && window.navigator.onLine;
}


class FallbackTTS implements TTSStrategy {
  private primary: TTSStrategy;
  private fallback: TTSStrategy;

  constructor(primary: TTSStrategy, fallback: TTSStrategy) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async speak(
    text: string,
    persona: string | null,
    onEnd?: () => void,
    onStart?: () => void,
    onStopLoad?: () => void,
    utteranceRef?: React.MutableRefObject<SpeechSynthesisUtterance | null>,
    audioRef?: React.MutableRefObject<HTMLAudioElement | null>
  ): Promise<void> {
    // Skip Polly if offline
    if (!isOnline()) {
      console.warn("Offline detected, using browser TTS.");
      await this.fallback.speak(text, persona, onEnd, onStart, onStopLoad, utteranceRef, audioRef);
      return;
    }
    
    try {
      await this.primary.speak(text, persona, onEnd, onStart, onStopLoad, utteranceRef, audioRef);
    } catch (error) {
      console.warn("Primary TTS failed, falling back to browser TTS:", error);
      await this.fallback.speak(text, persona, onEnd, onStart, onStopLoad, utteranceRef, audioRef);
    }
  }
}

/**
 * Factory class to choose between TTS engines
 */
export class TTSFactory {
  static getTTS(engine: "polly" | "browser" | "fallback"): TTSStrategy {
    if (engine === "polly") {
      return new PollyTTS();
    } else if (engine === "fallback") {
      return new FallbackTTS(new PollyTTS(), new BrowserTTS());
    } else {
      return new BrowserTTS();
    }
  }

  static create(engine: "polly" | "browser" | "fallback"): TTSStrategy {
    return this.getTTS(engine);
  }
}

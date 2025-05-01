import { playBrowserTTS } from "./browserTTS";
import { playPersonaSpeech } from "./polly";

export interface TTSStrategy {
    speak: (
      text: string,
      persona: string | null,
      onEnd?: () => void,
      onStart?: () => void,
      onStopLoad?: () => void
    ) => Promise<void>;
  }

  class PollyTTS implements TTSStrategy {
    async speak(
      text: string,
      persona: string | null,
      onEnd?: () => void,
      onStart?: () => void,
      onStopLoad?: () => void
    ): Promise<void> {
      if (!persona) {
        console.warn("PollyTTS: persona is null");
        return;
      }
      try {
        await playPersonaSpeech(text, persona, onEnd, onStart, onStopLoad);
      } catch (error) {
        console.error("PollyTTS error:", error);
        onStopLoad?.();
      }
    }
  }

  class BrowserTTS implements TTSStrategy {
    async speak(
      text: string,
      persona: string | null,
      onEnd?: () => void,
      onStart?: () => void,
      onStopLoad?: () => void
    ): Promise<void> {
      try {
        await new Promise<void>((resolve) => {
          playBrowserTTS(text, persona, onEnd, onStart, onStopLoad);
        });
      } catch (error) {
        console.error("BrowserTTS error:", error);
        onStopLoad?.();
      }
    }
  }

  export class TTSFactory {
    static getTTS(engine: "polly" | "browser"): TTSStrategy {
      // Note: We've moved persona to be passed during speak() instead of construction
      if (engine === "polly") {
        return new PollyTTS();
      } else {
        return new BrowserTTS();
      }
    }
  
    // Optional: Keep create() as an alias if needed elsewhere
    static create(engine: "polly" | "browser"): TTSStrategy {
      return this.getTTS(engine);
    }
  }

export const playBrowserTTS = (
  text: string,
  persona: string | null,
  utteranceRef: React.MutableRefObject<SpeechSynthesisUtterance | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
) => {
  // 1. Cancel any ongoing speech (works everywhere)
  try {
    speechSynthesis.cancel();
  } catch (e) {
    console.warn("Failed to cancel speech:", e);
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utteranceRef.current = utterance;

  // 2. Set default TTS properties (cross-browser safe)
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // 3. Event handlers (universal)
  utterance.onend = () => {
    onEnd?.();
    utteranceRef.current = null;
  };
  utterance.onerror = (e) => {
    console.error("TTS Error:", e.error);
    onEnd?.();
  };
  utterance.onstart = () => onStart?.();

  // 4. Voice selection logic (browser-specific)
  const setVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    
    // Retry if no voices (Safari/Edge sometimes empty first)
    if (voices.length === 0) {
      setTimeout(setVoiceAndSpeak, 100);
      return;
    }

    // Select voice based on persona + browser
    let selectedVoice = voices.find((v) => {
      if (persona === "Jenna") {
        return (
          v.name.includes("Female") ||
          v.name.includes("Samantha") || // Safari
          v.name.includes("Google US Female") || // Chrome
          v.name.includes("Zira") // Edge
        );
      } else if (persona === "Marcus") {
        return (
          v.name.includes("Male") ||
          v.name.includes("Daniel") || // Safari
          v.name.includes("Google US Male") || // Chrome
          v.name.includes("David") // Edge
        );
      }
      return false;
    });

    // Fallback: Use first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
      console.warn("No persona match, using default voice");
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using voice:", selectedVoice.name);
    }

    // 5. Finally, speak (works on all browsers if triggered by user)
    try {
      onStopLoad?.();
      speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("speak() failed:", e);
      onEnd?.();
    }
  };

  // 6. Load voices (Safari needs this, others ignore)
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};
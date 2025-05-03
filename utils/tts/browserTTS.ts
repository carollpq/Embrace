export const playBrowserTTS = (
  text: string,
  persona: string | null,
  utteranceRef: React.MutableRefObject<SpeechSynthesisUtterance | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
) => {
  // Cancel current speech to avoid overlap
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utteranceRef.current = utterance;

  utterance.onend = () => {
    onEnd?.();
    utteranceRef.current = null;
  };

  utterance.onstart = () => {
    onStart?.();
  };

  // Ensure voices are loaded (especially on iOS where it can be delayed)
  const setVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined = undefined;

    // Prefer common, US English voices
    const americanVoices = voices.filter(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Apple") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("david"))
    );

    // Match by known voice names for reliability
    if (persona === "Jenna") {
      selectedVoice =
        americanVoices.find(
          (v) =>
            v.name.includes("Google") && v.name.toLowerCase().includes("female")
        ) ||
        americanVoices.find((v) => v.name.toLowerCase().includes("zira")) ||
        americanVoices.find((v) => v.name.toLowerCase().includes("samantha"));
    } else if (persona === "Marcus") {
      selectedVoice =
        americanVoices.find(
          (v) =>
            v.name.includes("Google") && v.name.toLowerCase().includes("male")
        ) ||
        americanVoices.find((v) => v.name.toLowerCase().includes("david")) ||
        americanVoices.find((v) => v.name.toLowerCase().includes("microsoft"));
    }

    // Fallback to any available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      console.log("Selected voice:", selectedVoice?.name);
      utterance.voice = selectedVoice;
    }

    onStopLoad?.();
    onStart?.();
    speechSynthesis.speak(utterance);
  };

  // Wait for voices to be ready if not yet loaded
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      setVoiceAndSpeak();
      speechSynthesis.onvoiceschanged = null;
    };
  } else {
    setVoiceAndSpeak();
  }
};

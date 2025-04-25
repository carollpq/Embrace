export const playBrowserTTS = (
  text: string,
  persona: string | null,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void,
) => {
  // Cancel any current speech before starting a new one
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (onEnd) {
    utterance.onend = onEnd;
  }

  const setVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined = undefined;

    const americanVoices = voices.filter(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Apple") ||
          true)
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

    // Fallback
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

  // Wait until voices are loaded before proceeding
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      setVoiceAndSpeak();
      // Remove handler to prevent multiple calls
      speechSynthesis.onvoiceschanged = null;
    };
  } else {
    setVoiceAndSpeak();
  }
};

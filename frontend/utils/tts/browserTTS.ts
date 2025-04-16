export const playBrowserTTS = (text: string, persona: string | null) => {
  // Cancel any current speech before starting a new one
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const setVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();


    let selectedVoice: SpeechSynthesisVoice | undefined = undefined;

    // Match by known voice names for reliability
    if (persona === "Jenna") {
      selectedVoice =
        voices.find((v) => v.name.includes("Female")) ||
        voices.find((v) => v.name.includes("Google UK English Female")) ||
        voices.find((v) => v.name.includes("Microsoft Zira"))
        voices.find((v) => v.name.toLowerCase().includes("female"));
    } else if (persona === "Marcus") {
      selectedVoice =
        voices.find((v) => v.name.includes("Male")) ||
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => v.name.includes("Microsoft David")) ||
        voices.find((v) => v.name.toLowerCase().includes("male"));
    }

    // Fallback
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      console.log("Selected voice:", selectedVoice?.name);
      utterance.voice = selectedVoice;
    }

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

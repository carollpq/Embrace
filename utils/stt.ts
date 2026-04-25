let recognitionInstance: SpeechRecognition | null = null;
let stopTimeout: ReturnType<typeof setTimeout> | null = null;
let isRunning = false; // global flag to track status
let isStopping = false;

/** Start speech recognition and return the recognition instance */
export const startSpeechRecognition = (
  onTranscript: (transcript: string) => void
) => {
  if (isRunning) {
    return null;
  }

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      isRunning = true;
      isStopping = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        if (transcript) {
          onTranscript(transcript);
        }
      }
    };

    recognition.onspeechend = () => {
      if (isStopping) return;

      stopTimeout = setTimeout(() => {
        recognition.stop();
      }, 30000);
    };

    recognition.onspeechstart = () => {
      if (stopTimeout) {
        clearTimeout(stopTimeout);
        stopTimeout = null;
      }
    };

    recognition.onend = () => {
      isRunning = false;
      recognitionInstance = null;
      isStopping = false;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access is blocked. Please enable microphone permissions."
        );
      }
    };

    recognition.start();
    recognitionInstance = recognition;
    return recognition;
  } else {
    console.error("Speech Recognition not supported in this browser");
    return null;
  }
};

/** Stop speech recognition manually */
export const stopSpeechRecognition = () => {
  if (recognitionInstance) {
    isStopping = true;
    recognitionInstance.stop();
    recognitionInstance = null;
    isRunning = false;
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
  }
};

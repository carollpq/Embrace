let recognitionInstance: SpeechRecognition | null = null;
let stopTimeout: ReturnType<typeof setTimeout> | null = null;
let isRunning = false; // global flag to track status
let isStopping = false;

/** Start speech recognition and return the recognition instance */
export const startSpeechRecognition = (
  onTranscript: (transcript: string) => void
) => {
  if (isRunning) {
    console.warn("Recognition already running.");
    return null;
  }

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      console.log("Recognition started");
      isRunning = true;
      isStopping = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        if (transcript) {
          console.log("Final transcript:", transcript);
          onTranscript(transcript);
        }
      }
    };

    recognition.onspeechend = () => {
      if (isStopping) {
        console.log("Speech ended — but already stopping, ignoring timeout.");
        return;
      }

      console.log("Pause detected — setting timeout");
      stopTimeout = setTimeout(() => {
        console.log("Stopping after pause");
        recognition.stop();
      }, 30000);
    };

    recognition.onspeechstart = () => {
      if (stopTimeout) {
        clearTimeout(stopTimeout);
        stopTimeout = null;
        console.log("Speech resumed. Canceling stop.");
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
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
    console.log("Speech recognition started.");
    return recognition;
  } else {
    console.error("Speech Recognition not supported in this browser");
    return null;
  }
};

/** Stop speech recognition manually */
export const stopSpeechRecognition = () => {
  if (recognitionInstance) {
    console.log("Manually stopped recognition");
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

export const startSpeechRecognition = (onTranscript: (transcript: string) => void) => {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onspeechend = () => {
      console.log('Speech ended.');
      recognition.stop();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        console.log('No speech detected, please try again.');
        //recognition.start(); // Restart recognition if no speech detected
      }

      if (event.error === 'not-allowed') {
        alert('Microphone access is blocked. Please enable microphone permissions.');
      }
    };

    recognition.start();
  } else {
    console.error('Speech Recognition not supported in this browser');
  }
};

// utils/stt.ts
export const startSpeechRecognition = (onTranscript: (transcript: string) => void) => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US'; 
      recognition.interimResults = true; // Show partial speech recognition results
  
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
  
      recognition.start();
    } else {
      console.error('Speech Recognition not supported in this browser');
    }
  };
  
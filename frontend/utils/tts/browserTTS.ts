export function playBrowserTTS(text: string) {
    if (!window.speechSynthesis) {
      console.error("Browser does not support speech synthesis.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Adjust language as needed
    utterance.rate = 1; // Speed (1 is normal)
    utterance.pitch = 1; // Pitch (1 is normal)
    
    speechSynthesis.speak(utterance);
  }
import { Message } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { TTSFactory } from "@/utils/tts/TTSFactory";
import { removeEmojis, isLastAssistantMessage } from "@/utils/chatMessageUtils";
import { useModal } from "@/context/ModalContext";

export const useTextToSpeech = ({
  message,
  isUser,
  selectedMode,
  selectedTTS,
  selectedPersona,
  messages,
  hasUserTriggeredResponse,
  setHasUserTriggeredResponse,
}: {
  message: Message;
  isUser: boolean;
  selectedMode: string | null;
  selectedTTS: string | null;
  selectedPersona: string | null;
  messages: Message[];
  hasUserTriggeredResponse: boolean;
  setHasUserTriggeredResponse: (value: boolean) => void;
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const lastSpokenMessage = useRef<string | null>(null);
  const hasPlayedTTS = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { triggerTTSFallback } = useModal();

  /**
   * Function to speak the assistant's message using the selected TTS engine.
   * Includes fallback for offline mode.
   */
  const speak = async () => {
    if (!message.content) return;
    const cleanedText = removeEmojis(message.content);
    try {
      setIsLoadingAudio(true);
      const isOffline = typeof window !== "undefined" && !navigator.onLine;
      const ttsEngine = TTSFactory.create(selectedTTS);

      if (isOffline) {
        throw new Error("Offline mode detected. Falling back to browser TTS.");
      }
      await ttsEngine.speak(
        cleanedText,
        selectedPersona,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true),
        () => setIsLoadingAudio(false),
        utteranceRef,
        audioRef
      );
    } catch (error) {
      console.error("TTS error:", error);

      // Show fallback popup modal
      triggerTTSFallback?.();

      // Fallback to browser TTS
      try {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };
      } catch (fallbackError) {
        console.error("Browser TTS fallback failed:", fallbackError);
      }

      setIsSpeaking(false);
      setIsLoadingAudio(false);
    }
  };

  const pause = () => {
    if (selectedTTS === "browser") {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setIsPaused(true);
      }
    }
  };
  
  const resume = () => {
    if (selectedTTS === "browser") {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } else {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().then(() => setIsPaused(false)).catch(console.error);
      }
    }
  };
  
  // Play TTS for latest assistant message
  useEffect(() => {
    if (
      !isUser &&
      message.content &&
      message.content !== lastSpokenMessage.current &&
      (selectedMode === "text-and-voice" ||
        selectedMode === "voice-and-voice") &&
      isLastAssistantMessage(messages, message.content)
    ) {
      speak();
      lastSpokenMessage.current = message.content;
      setHasUserTriggeredResponse(false);
    }
  }, [
    message.content,
    isUser,
    selectedMode,
    selectedTTS,
    selectedPersona,
    messages,
    hasUserTriggeredResponse,
  ]);

  // Optional cleanup effect
  useEffect(() => {
    hasPlayedTTS.current = false;
  }, [message.content]);

  return { isSpeaking, isLoadingAudio, speak, isPaused, pause, resume };
};

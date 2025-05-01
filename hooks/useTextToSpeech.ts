import { Message } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { TTSFactory } from "@/utils/tts/TTSFactory";
import { removeEmojis, isLastAssistantMessage } from "@/utils/chatMessageUtils";

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

  const speak = async () => {
    if (!message.content) return;
    const cleanedText = removeEmojis(message.content);
    try {
      setIsLoadingAudio(true);
      const ttsEngine = TTSFactory.getTTS(selectedTTS);
      await ttsEngine.speak(
        cleanedText,
        selectedPersona,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true),
        () => setIsLoadingAudio(false)
      );
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
      setIsLoadingAudio(false);
    }
  };

  // Play TTS for latest assistant message
  useEffect(() => {
    if (
      !isUser &&
      message.content &&
      message.content !== lastSpokenMessage.current &&
      (selectedMode === "text-and-voice" || selectedMode === "voice-and-voice") &&
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

  return { isSpeaking, isLoadingAudio, speak };
};
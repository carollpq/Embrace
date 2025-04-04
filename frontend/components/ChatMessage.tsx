"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect } from "react";
import { playPersonaSpeech } from "@/utils/tts/polly";
import { playBrowserTTS } from "@/utils/tts/browserTTS";
import { useSession } from "@/context/Provider";

function removeEmojis(text: string): string {
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

const ChatMessage = ({ message }: {message: Message}) => {
  const isUser = message.role === "user";
  const { selectedMode, selectedPersona, selectedTTS } = useSession();

  useEffect(() => {
    // Trigger TTS only for chatbot messages
    if (!isUser && message.content && (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice")) {
      const cleanedText = removeEmojis(message.content); // Remove emojis before TTS

      if (selectedTTS === "polly") {
        playPersonaSpeech(cleanedText, selectedPersona).catch((error) =>
          console.error("Error playing Polly TTS:", error)
        );
      } else {
        playBrowserTTS(cleanedText);
      }
    }
  }, [message.content, isUser, selectedPersona, selectedMode, selectedTTS]);

  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`${isUser ? style["chat-message-user"] : style["chat-message-chatbot"]} ${
          isUser ? "bg-black/80" : "bg-[#e1f4ff]/80"
        } rounded-lg px-5 text-lg font-normal`}
      >
        {message.content || "Message is empty"}
      </div>
    </div>
  );
};

export default ChatMessage;

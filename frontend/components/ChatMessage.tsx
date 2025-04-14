"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect, useRef } from "react";
import { playPersonaSpeech } from "@/utils/tts/polly";
import { playBrowserTTS } from "@/utils/tts/browserTTS";
import { useSession } from "@/context/Provider";

function removeEmojis(text: string): string {
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  const isTypingPlaceholder = message.content === "__typing__";
  const { selectedMode, selectedPersona, selectedTTS, fontSize } = useSession();
  const hasPlayedTTS = useRef(false); // Track if TTS has already played for this message

  // Trigger TTS only once for chatbot messages
  useEffect(() => {
    if (
      !isUser &&
      message.content &&
      message.content !== "__typing__" &&
      (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice") &&
      !hasPlayedTTS.current // Only play if not already played
    ) {
      const cleanedText = removeEmojis(message.content);
      console.log(cleanedText);

      if (selectedTTS === "polly") {
        playPersonaSpeech(cleanedText, selectedPersona).catch((error) =>
          console.error("Error playing Polly TTS:", error)
        );
      } else {
        playBrowserTTS(cleanedText, selectedPersona);
      }

      hasPlayedTTS.current = true; // Mark that TTS has been played for this message
    }
  }, [message.content, isUser, selectedMode, selectedTTS, selectedPersona]);

  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`${
          isUser ? style["chat-message-user"] : style["chat-message-chatbot"]
        } ${
          isUser ? "bg-black/80" : "bg-[#e1f4ff]/80"
        } rounded-lg px-5 text-lg font-normal whitespace-pre-line shadow-lg ${fontSize === "sm" ? "text-sm-msg" : fontSize === "lg" ? "text-lg-msg" : fontSize === "xl" ? "text-xl-msg" : "text-base-msg"}`}
      >
        {isTypingPlaceholder ? (
          <div className="flex space-x-1 items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot" style={{ animationDelay: '0s' }}/>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot" style={{ animationDelay: '0.2s' }}/>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot" style={{ animationDelay: '0.4s' }}/>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

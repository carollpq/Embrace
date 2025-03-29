"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect } from "react";
import { playPersonaSpeech } from "@/utils/polly";
import { playCoquiSpeech } from "@/utils/coqui";
import { useSession } from "@/context/Provider";


const ChatMessage = ({ message }: {message: Message}) => {
  const isUser = message.role === "user";
  const { selectedMode, selectedPersona, selectedTTS } = useSession();

  useEffect(() => {
    // Trigger TTS only for chatbot messages
    if (!isUser && message.content && (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice")) {
      if (selectedTTS === "polly") {
        playPersonaSpeech(message.content, selectedPersona).catch((error) =>
          console.error("Error playing Polly TTS:", error)
        );
      } else {
        playCoquiSpeech(message.content).catch((error) =>
          console.error("Error playing Coqui TTS:", error)
        );
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

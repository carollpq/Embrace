"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect } from "react";
import { playPersonaSpeech } from "@/utils/polly";
import { useSession } from "@/context/Provider";


const ChatMessage = ({ message }: {message: Message}) => {
  const isUser = message.role === "user";
  const { selectedMode, selectedPersona } = useSession();

  useEffect(() => {
    // Trigger TTS only for chatbot messages
    if (!isUser && message.content && (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice")) {
      playPersonaSpeech(message.content, selectedPersona).catch((error) =>
        console.error("Error playing TTS:", error)
      );
    }
  }, [message.content, isUser, selectedPersona, selectedMode]);

  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`${isUser ? style["chat-message-user"] : style["chat-message-chatbot"]} ${
          isUser ? "bg-black/50" : "bg-[#e1f4ff]/50"
        } rounded-lg p-2 text-md`}
      >
        {message.content || "Message is empty"}
      </div>
    </div>
  );
};

export default ChatMessage;

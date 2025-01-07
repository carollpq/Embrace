"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";


const ChatMessage = ({ message }: {message: Message}) => {
  const isUser = message.role === "user";
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

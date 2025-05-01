"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useState } from "react";
import { useSession } from "@/context/Provider";
import Image from "next/image";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const ChatMessage = ({
  message,
  isBookmarked,
  toggleBookmark,
}: {
  message: Message;
  isBookmarked: boolean;
  toggleBookmark: () => void;
}) => {
  const isUser = message.role === "user";
  const isTypingPlaceholder = message.content === "__typing__";
  const {
    selectedMode,
    selectedPersona,
    selectedTTS,
    fontSize,
    messages,
    hasUserTriggeredResponse,
    setHasUserTriggeredResponse,
  } = useSession();

  const [isSavingMessage, setIsSavingMessage] = useState(false);
  
  const { isSpeaking, isLoadingAudio, speak } = useTextToSpeech({
    message,
    isUser,
    selectedMode,
    selectedTTS,
    selectedPersona,
    messages,
    hasUserTriggeredResponse,
    setHasUserTriggeredResponse,
  });

  const handleToggleSave = async () => {
    setIsSavingMessage(true);
    try {
      await toggleBookmark();
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    } finally {
      setIsSavingMessage(false);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`relative ${
          isUser ? style["chat-message-user"] : style["chat-message-chatbot"]
        } ${
          isUser ? "bg-black/80" : "bg-[#e1f4ff]/80"
        } rounded-lg p-6 text-lg font-normal whitespace-pre-line shadow-lg ${
          fontSize === "sm"
            ? "text-sm-msg"
            : fontSize === "lg"
            ? "text-lg-msg"
            : fontSize === "xl"
            ? "text-xl-msg"
            : "text-base-msg"
        }`}
      >
        {isTypingPlaceholder ? (
          <div className="flex space-x-1 items-center">
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        ) : (
          message.content
        )}

        {/* Save Icon */}
        {!isUser && !isTypingPlaceholder && (
          <button title="Save message" disabled={isSavingMessage}>
            {isSavingMessage ? (
              <div className="w-5 h-5 absolute top-2 right-3 border-4 border-black/20 border-t-black/50 rounded-full animate-spin delay-1000"></div>
            ) : (
              <Image
                className="hover:cursor-pointer absolute top-2 right-3"
                src={
                  isBookmarked
                    ? "/icons/saved-icon.svg"
                    : "/icons/to-be-saved-icon.svg"
                }
                alt="Save icon"
                width={18}
                height={18}
                onClick={handleToggleSave}
              />
            )}
          </button>
        )}

        {/* Replay */}
        {!isUser &&
          !isTypingPlaceholder &&
          (selectedMode === "text-and-voice" ||
            selectedMode === "voice-and-voice") && (
            <div className="absolute top-2 left-3 flex gap-3">
              <button
                title="Play audio"
                onClick={speak}
                className="text-blue-500 hover:text-blue-700 text-sm underline"
              >
                {isLoadingAudio ? (
                  <div className="w-4 h-4 absolute top-1 border-4 border-black/20 border-t-black/50 rounded-full animate-spin delay-1000"></div>
                ) : (
                  <Image
                    className="hover:cursor-pointer"
                    src={isSpeaking ? "/icons/is-speaking.svg" : "/icons/not-speak.svg"}
                    alt="Speaker icon"
                    width={18}
                    height={18}
                  />
                )}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatMessage;
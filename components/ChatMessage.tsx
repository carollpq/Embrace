"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { playPersonaSpeech } from "@/utils/tts/polly";
import { playBrowserTTS } from "@/utils/tts/browserTTS";
import { useSession } from "@/context/Provider";
import Image from "next/image";

function removeEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/[*#/\\~_`|<>{}[\]()]/g, "")
    .trim();
}

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
    //session,
    messages,
    hasUserTriggeredResponse,
    setHasUserTriggeredResponse,
  } = useSession();

  const lastSpokenMessage = useRef<string | null>(null); // Track the last spoken message content

  const hasPlayedTTS = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSavingMessage, setIsSavingMessage] = useState(false);

  const isLastAssistantMessage = () => {
    const assistantMessages = messages?.filter(
      (msg) => msg.role === "assistant" && msg.content !== "__typing__"
    );
    return (
      assistantMessages?.length > 0 &&
      assistantMessages[assistantMessages.length - 1].content ===
        message.content
    );
  };

  const speak = async () => {
    if (!message.content) return;
    const cleanedText = removeEmojis(message.content);
    setIsSpeaking(true);

    const onSpeechEnd = () => setIsSpeaking(false);

    try {
      if (selectedTTS === "polly") {
        await playPersonaSpeech(cleanedText, selectedPersona); //set on speech end here??
      } else {
        playBrowserTTS(cleanedText, selectedPersona, onSpeechEnd);
        return;
      }
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      onSpeechEnd();
    }
  };

  // Play TTS for latest assistant message
  useEffect(() => {
    if (
      !isUser &&
      message.content &&
      message.content !== lastSpokenMessage.current && // Only speak if different from last spoken message
      (selectedMode === "text-and-voice" || selectedMode === "voice-and-voice") &&
      isLastAssistantMessage()
    ) {
      speak(); // Trigger TTS
      lastSpokenMessage.current = message.content; // Update the last spoken message content
      setHasUserTriggeredResponse(false); // Reset the flag
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

  // ✅ Optional cleanup effect — resets flag when message content changes
  useEffect(() => {
    hasPlayedTTS.current = false;
  }, [message.content]);

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

        {/*  Replay  */}
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
                <Image
                  className="hover:cursor-pointer"
                  src={
                    isSpeaking
                      ? "/icons/is-speaking.svg"
                      : "/icons/not-speak.svg"
                  }
                  alt="Speaker icon"
                  width={18}
                  height={18}
                />
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatMessage;

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

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  const isTypingPlaceholder = message.content === "__typing__";
  const { selectedMode, selectedPersona, selectedTTS, fontSize, session } =
    useSession();
  const hasPlayedTTS = useRef(false); // Track if TTS has already played for this message
  const [isSaved, setIsSaved] = useState(false);

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

  // Check the already saved messages 
  useEffect(() => {
    const checkIfMessageIsSaved = async () => {
      if (!isUser && message.content && session?.email) {
        try {
          const res = await fetch(`/api/get-saved-messages?userId=${session.email}`);
          const data = await res.json();
          const savedMessages = data.savedMessages || [];
  
          const found = savedMessages.some((msg: { content: string }) =>
            msg.content === message.content
          );
  
          setIsSaved(found);
        } catch (error) {
          console.error("Error checking saved messages:", error);
        }
      }
    };
  
    checkIfMessageIsSaved();
  }, [session?.email, message.content, isUser]);
  

  const handleToggleSave = async () => {
    const payload = {
      userId: session?.email,
      content: message.content,
    };

    if (!isSaved) {
      // Save the message
      try {
        const res = await fetch("/api/save-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) setIsSaved(true);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    } else {
      // Delete the message
      try {
        const res = await fetch("/api/delete-saved-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) setIsSaved(false);
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center pt-3">
      {/* Chat bubble */}
      <div
        className={`${
          isUser ? style["chat-message-user"] : style["chat-message-chatbot"]
        } ${
          isUser ? "bg-black/80" : "bg-[#e1f4ff]/80"
        } rounded-lg px-5 text-lg font-normal whitespace-pre-line shadow-lg ${
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
        {/* Save icon for assistant messages only */}
        {!isUser && !isTypingPlaceholder && (
          <Image
            className="hover:cursor-pointer justify-start"
            src={
              isSaved ? "/icons/saved-icon.svg" : "/icons/to-be-saved-icon.svg"
            }
            alt="Saved icon"
            width={24}
            height={24}
            onClick={handleToggleSave}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

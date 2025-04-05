"use client";

import style from "../styles/ChatMessage.module.css";
import { Message } from "ai/react";
import { useEffect, useState } from "react";
import { playPersonaSpeech } from "@/utils/tts/polly";
import { playBrowserTTS } from "@/utils/tts/browserTTS";
import { useSession } from "@/context/Provider";

function removeEmojis(text: string): string {
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

const TYPING_SPEED = 20; // ms per character
// const WORD_SPEED = 100; // ms per word (if switching to word-by-word mode)

const ChatMessage = ({ message }: {message: Message}) => {
  const isUser = message.role === "user";
  const { selectedMode, selectedPersona, selectedTTS } = useSession();
  const [displayedText, setDisplayedText] = useState(isUser ? message.content : ""); // starts empty for bot
  const [isTyping, setIsTyping] = useState(!isUser);

  // useEffect(() => {
  //   // Trigger TTS only for chatbot messages
  //   if (!isUser && message.content && (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice")) {
  //     const cleanedText = removeEmojis(message.content); // Remove emojis before TTS

  //     if (selectedTTS === "polly") {
  //       playPersonaSpeech(cleanedText, selectedPersona).catch((error) =>
  //         console.error("Error playing Polly TTS:", error)
  //       );
  //     } else {
  //       playBrowserTTS(cleanedText);
  //     }
  //   }
  // }, [message.content, isUser, selectedPersona, selectedMode, selectedTTS]);

  // Typing effect for assistant
  useEffect(() => {
    if (!isUser && message.content) {
      let i = 0;
      setDisplayedText(""); // clear before typing
      setIsTyping(true);

      // Character-by-character simulation
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + message.content.charAt(i));
        i++;
        if (i >= message.content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPING_SPEED);

      return () => clearInterval(interval);

      // Word-by-word version (optional):
      // const words = message.content.split(" ");
      // const interval = setInterval(() => {
      //   setDisplayedText((prev) => prev + (prev ? " " : "") + words[i]);
      //   i++;
      //   if (i >= words.length) {
      //     clearInterval(interval);
      //     setIsTyping(false);
      //   }
      // }, WORD_SPEED);
    }
  }, [message.content, isUser]);

  useEffect(() => {
    if (
      !isUser && !isTyping &&
      displayedText === message.content &&
      message.content &&
      (selectedMode == "text-and-voice" || selectedMode == "voice-and-voice")
    ) {
      const cleanedText = removeEmojis(message.content);

      if (selectedTTS === "polly") {
        playPersonaSpeech(cleanedText, selectedPersona).catch((error) =>
          console.error("Error playing Polly TTS:", error)
        );
      } else {
        playBrowserTTS(cleanedText);
      }
    }
  }, [displayedText, selectedPersona, selectedMode, selectedTTS, message.content, isUser, isTyping]);

  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`${isUser ? style["chat-message-user"] : style["chat-message-chatbot"]} ${
          isUser ? "bg-black/80" : "bg-[#e1f4ff]/80"
        } rounded-lg px-5 text-lg font-normal whitespace-pre-line`}
      >
        {isUser ? message.content : `${displayedText}${isTyping ? "▋" : ""}`} {/* Blinking cursor ▋ */}
      </div>
    </div>
  );
};

export default ChatMessage;

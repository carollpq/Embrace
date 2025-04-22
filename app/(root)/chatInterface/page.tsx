"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useRef, useLayoutEffect, useEffect, FormEvent, useState } from "react";
import { useSession } from "@/context/Provider";
import { motion, AnimatePresence } from "framer-motion";
import { stopSpeech } from "@/utils/tts/polly";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    setMessages,
    chatInput,
    setChatInput,
    selectedPersona,
    customTraits,
    selectedMood,
    session,
    setHasUserTriggeredResponse,
  } = useSession();
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([]);
  const [hasLoadedBookmarks, setHasLoadedBookmarks] = useState(false);

  const moodToPrompt: Record<string, string> = {
    Anxious: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm feeling anxious.`,
    Sad: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm feeling really sad today.`,
    Angry: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm angry about something that happened.`,
    Happy: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm in a happy mood today!`,
    Neutral: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm feeling okay, nothing in particular.`,
    Stressed: `Hey there, ${
      session ? `I'm ${session.name}.` : ""
    } I'm stressed and overwhelmed.`,
  };

  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedMessages");
    if (saved) {
      setBookmarkedMessages(JSON.parse(saved));
      console.log("Loaded bookmarks from localStorage:", JSON.parse(saved));
    }
    setHasLoadedBookmarks(true);
  }, []);

  // Clear bookmarked messages from localStorage when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Optional: Prevent refresh if you want
      e.preventDefault();
      localStorage.removeItem("bookmarkedMessages");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (hasLoadedBookmarks) {
      localStorage.setItem(
        "bookmarkedMessages",
        JSON.stringify(bookmarkedMessages)
      );
      console.log("Updated localStorage with bookmarks:", bookmarkedMessages);
    }
  }, [bookmarkedMessages, hasLoadedBookmarks]);

  // Stop speech on mount/unmount
  useEffect(() => {
    stopSpeech();

    return () => {
      stopSpeech();
    };
  }, []);

  // Prevent page refresh while chatting
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages]);

  // Mood-based intro
  useEffect(() => {
    const sendIntroFromMood = async () => {
      if (messages.length === 0 && selectedMood && moodToPrompt[selectedMood]) {
        const introMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content: moodToPrompt[selectedMood],
        };

        setMessages([
          introMessage,
          {
            id: "typing-placeholder",
            role: "assistant" as const,
            content: "__typing__",
          },
        ]);

        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [introMessage],
            selectedPersona,
            selectedMood,
            ...(customTraits && { customTraits }),
          }),
        });

        const data = await res.json();

        setMessages([
          introMessage,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.content,
          },
        ]);
      }
    };

    sendIntroFromMood();
  }, [messages.length, selectedMood, selectedPersona, customTraits]);

  // Toggles the bookmarked state of the assistant messages
  const toggleBookmark = async (message: { id: string; content: string }) => {
    try {
      const isBookmarked = bookmarkedMessages.includes(message.id);

      if (!isBookmarked) {
        setBookmarkedMessages((prev) => [...prev, message.id]);

        const res = await fetch("/api/save-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session?.email,
            content: message.content,
            messageId: message.id,
          }),
        });

        if (!res.ok) {
          console.error("Failed to save bookmarked message");
          setBookmarkedMessages((prev) =>
            prev.filter((id) => id !== message.id)
          );
        }
      } else {
        setBookmarkedMessages((prev) => prev.filter((id) => id !== message.id));

        const res = await fetch("/api/delete-saved-message", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: message.id,
            userId: session?.email,
          }),
        });

        if (!res.ok) {
          console.error("Failed to delete bookmarked message");
          setBookmarkedMessages((prev) => [...prev, message.id]);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const isBookmarked = (messageId: string) =>
    bookmarkedMessages.includes(messageId);

  // ✍️ Handle text submit
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e?.preventDefault) e.preventDefault();
    stopSpeech();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: chatInput,
    };

    const typingPlaceholder = {
      id: "typing-placeholder",
      role: "assistant" as const,
      content: "__typing__",
    };

    setMessages((prev) => [...prev, userMessage, typingPlaceholder]);
    setChatInput("");

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        selectedPersona,
        selectedMood,
        ...(customTraits && { customTraits }),
      }),
    });

    const data = await res.json();

    setMessages((prev) =>
      prev
        .filter((msg) => msg.id !== "typing-placeholder")
        .concat({
          id: Date.now().toString(),
          role: "assistant" as const,
          content: data.content,
        })
    );
  };

  // Handle voice input
  const handleDirectSubmit = async (text: string) => {
    stopSpeech();
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
    };

    const typingPlaceholder = {
      id: "typing-placeholder",
      role: "assistant" as const,
      content: "__typing__",
    };

    setMessages((prev) => [...prev, userMessage, typingPlaceholder]);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        selectedPersona,
        selectedMood,
        ...(customTraits && { customTraits }),
      }),
    });

    const data = await res.json();

    setMessages((prev) =>
      prev
        .filter((msg) => msg.id !== "typing-placeholder")
        .concat({
          id: Date.now().toString(),
          role: "assistant" as const,
          content: data.content,
        })
    );
  };

  // Auto scroll on new messages
  useLayoutEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative">
      <div className="flex flex-col h-[85vh] justify-between mt-4">
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto h-[100px] hide-scrollbar"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-4xl text-white animate-slideUp delay-1000">
              Hi, I&apos;m here for you 🤗
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="px-4 py-2"
              >
                <ChatMessage
                  message={message}
                  isBookmarked={isBookmarked(message.id)}
                  toggleBookmark={() => toggleBookmark(message)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mb-[40px]">
          <InputBox
            handleSubmit={handleSubmit}
            handleInputChange={(e) => setChatInput(e.target.value)}
            handleDirectSubmit={handleDirectSubmit}
            input={chatInput}
            setHasUserTriggeredResponse={setHasUserTriggeredResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

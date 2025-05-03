"use client";

import InputBox from "@/components/inputBox/InputBox";
import ChatMessage from "@/components/chat/ChatMessage";
import { useRef, useLayoutEffect, useEffect, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stopSpeech } from "@/utils/tts/polly";
import SavedMessages from "@/components/sidebar/SavedMessages";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { useChat } from "@/context/ChatContext";
import { useModal } from "@/context/ModalContext";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Get session data
  const { user } = useSession();
  
  // Get chat state and methods
  const {
    messages,
    setMessages,
    input: chatInput,
    setInput: setChatInput,
    setHasUserTriggeredResponse,
    mood: selectedMood,
    customTraits,
  } = useChat();
  
  // Get settings
  const { 
    settings: { 
      persona: selectedPersona,
    } 
  } = useSettings();
  
  // Get modal state
  const { showSavedMessages } = useModal();

  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([]);
  const [hasLoadedBookmarks, setHasLoadedBookmarks] = useState(false);

  const moodToPrompt: Record<string, string> = {
    Anxious: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling anxious.`,
    Sad: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling really sad today.`,
    Angry: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm angry about something that happened.`,
    Happy: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm in a happy mood today!`,
    Neutral: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling okay, nothing in particular.`,
    Stressed: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm stressed and overwhelmed.`,
  };

  // Bookmark management effects remain the same
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedMessages");
    if (saved) setBookmarkedMessages(JSON.parse(saved));
    setHasLoadedBookmarks(true);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      localStorage.removeItem("bookmarkedMessages");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (hasLoadedBookmarks) {
      localStorage.setItem("bookmarkedMessages", JSON.stringify(bookmarkedMessages));
    }
  }, [bookmarkedMessages, hasLoadedBookmarks]);

  // Speech and message effects
  useEffect(() => {
    stopSpeech();
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
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
          { id: "typing-placeholder", role: "assistant", content: "__typing__" },
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
        setMessages([introMessage, {
          id: Date.now().toString(),
          role: "assistant",
          content: data.content,
        }]);
      }
    };
    sendIntroFromMood();
  }, [messages.length, selectedMood, selectedPersona, customTraits]);

  const toggleBookmark = async (message: { id: string; content: string }) => {
    try {
      const isBookmarked = bookmarkedMessages.includes(message.id);
      const newBookmarks = isBookmarked
        ? bookmarkedMessages.filter(id => id !== message.id)
        : [...bookmarkedMessages, message.id];
      
      setBookmarkedMessages(newBookmarks);
      
      const endpoint = isBookmarked ? "/api/delete-saved-message" : "/api/save-message";
      const method = isBookmarked ? "DELETE" : "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.email,
          content: message.content,
          messageId: message.id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${isBookmarked ? "delete" : "save"} bookmarked message`);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setBookmarkedMessages(prev => 
        bookmarkedMessages.includes(message.id)
          ? [...prev, message.id]
          : prev.filter(id => id !== message.id)
      );
    }
  };

  const isBookmarked = (messageId: string) => bookmarkedMessages.includes(messageId);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    stopSpeech();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: chatInput,
    };

    setMessages(prev => [...prev, userMessage, {
      id: "typing-placeholder",
      role: "assistant",
      content: "__typing__",
    }]);
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
    setMessages(prev => prev
      .filter(msg => msg.id !== "typing-placeholder")
      .concat({
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
      })
    );
  };

  const handleDirectSubmit = async (text: string) => {
    stopSpeech();
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
    };

    setMessages(prev => [...prev, userMessage, {
      id: "typing-placeholder",
      role: "assistant",
      content: "__typing__",
    }]);

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
    setMessages(prev => prev
      .filter(msg => msg.id !== "typing-placeholder")
      .concat({
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
      })
    );
  };

  useLayoutEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative px-6">
      {!showSavedMessages ? (
        <div className="flex flex-col h-[85vh] justify-between mt-4">
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto h-[100px] hide-scrollbar"
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full sm:text-4xl text-2xl text-white animate-slideUp delay-1000">
                Hi, I'm here for you 🤗
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
      ) : (
        <SavedMessages />
      )}
    </div>
  );
};

export default ChatInterface;
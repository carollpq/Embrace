"use client";

import ChatMessage from "@/components/chat/ChatMessage";
import { useRef, useLayoutEffect, useEffect, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stopSpeech } from "@/utils/tts/polly";
import SavedMessages from "@/components/sidebar/SavedMessages";
import { useSession } from "@/context/SessionContext";
import { useSettings } from "@/context/SettingsContext";
import { useChat } from "@/context/ChatContext";
import { useModal } from "@/context/ModalContext";
import InputBox from "@/components/InputBox";

const ChatInterface: React.FC = () => {
  // Reference to message container for scrolling
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Context hooks
  const { user } = useSession(); // Current user session data
  const {
    messages,
    setMessages,
    input: chatInput,
    setInput: setChatInput,
    setHasUserTriggeredResponse,
    mood: selectedMood,
    customTraits,
  } = useChat(); // Chat state management
  
  const { 
    settings: { 
      persona: selectedPersona,
    } 
  } = useSettings(); // User settings
  const { showSavedMessages } = useModal();  // Get modal state

  // State hooks
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([]); // Stores IDs of bookmarked messages
  const [hasLoadedBookmarks, setHasLoadedBookmarks] = useState(false); // Tracks if bookmarks have loaded

  // Maps mood values to corresponding prompt messages
  const moodToPrompt: Record<string, string> = {
    Anxious: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling anxious.`,
    Sad: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling really sad today.`,
    Angry: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm angry about something that happened.`,
    Happy: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm in a happy mood today!`,
    Neutral: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm feeling okay, nothing in particular.`,
    Stressed: `Hey there, ${user ? `I'm ${user.name}.` : ""} I'm stressed and overwhelmed.`,
  };

   // Load saved bookmarks from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedMessages");
    if (saved) setBookmarkedMessages(JSON.parse(saved));
    setHasLoadedBookmarks(true);
  }, []);

   // Clean up localStorage on window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      localStorage.removeItem("bookmarkedMessages");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Persist bookmarks to localStorage when they change
  useEffect(() => {
    if (hasLoadedBookmarks) {
      localStorage.setItem("bookmarkedMessages", JSON.stringify(bookmarkedMessages));
    }
  }, [bookmarkedMessages, hasLoadedBookmarks]);

  // Stop any ongoing speech when component unmounts
  useEffect(() => {
    stopSpeech();
    return () => stopSpeech();
  }, []);

  // Prevent accidental tab closure when messages exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages]);

  // Send introductory message based on selected mood if chat is empty
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

  /**
   * Toggles bookmark status for a message
   * @param message The message to bookmark/unbookmark
   */
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
      // Revert changes if API call fails
      setBookmarkedMessages(prev => 
        bookmarkedMessages.includes(message.id)
          ? [...prev, message.id]
          : prev.filter(id => id !== message.id)
      );
    }
  };

  // Checks if a message is bookmarked
  const isBookmarked = (messageId: string) => bookmarkedMessages.includes(messageId);

  /**
   * Handles form submission for chat input
   * @param e Optional form event
   */
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    stopSpeech();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: chatInput,
    };

    // Add user message and typing indicator
    setMessages(prev => [...prev, userMessage, {
      id: "typing-placeholder",
      role: "assistant",
      content: "__typing__",
    }]);
    setChatInput(""); // Clear input field

    // Send message to chatbot API
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

    // Replace typing indicator with actual response
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

  /**
   * Handles direct message submission
   * @param text The message text to send
   */
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

  // Auto-scroll to bottom when messages change
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
        // Main chat interface
        <div className="flex flex-col h-[85vh] justify-between mt-4">
          {/* Messages container */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto h-[100px] hide-scrollbar"
          >
            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full sm:text-4xl text-2xl text-white animate-slideUp delay-1000">
                Hi, I&apos;m here for you 🤗
              </div>
            )}
            {/* Animated messages list */}
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

          {/* Input box at bottom */}
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
        // Saved messages view
        <SavedMessages />
      )}
    </div>
  );
};

export default ChatInterface;
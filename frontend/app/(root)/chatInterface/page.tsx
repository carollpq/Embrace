"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "ai/react";
import { useRef, useLayoutEffect } from "react";
import { useSession } from "@/context/Provider";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null); // Reference for the messages container
  const { selectedPersona, customTraits, selectedMood } = useSession();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
  } = useChat({
    api: "api/chatbot",
    body: {
      selectedPersona,
      ...(customTraits && { customTraits }),
      selectedMood,
    },
    onResponse: async (response) => {
      try {
        const jsonResponse = await response.json();

        if (jsonResponse?.content) {
          setTimeout(() => {
            setMessages((prevMessages) => {
              // Remove the __typing__ message before adding the real one
              const filtered = prevMessages.filter(
                (msg) =>
                  msg.role !== "assistant" || msg.content !== "__typing__"
              );
              return [...filtered, jsonResponse];
            });
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing the response:", error);
      }
    },
  });

  //Add typing animation message after user sends input (overriding the original function)
  const handleSubmit = async (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    await originalHandleSubmit(e || { target: { value: input } });
    console.log("Submitted!", e);

    // Add typing animation
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "__typing__",
        },
      ]);
    }, 1000);
  };

  const handleDirectSubmit = async (text: string) => {
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

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      typingPlaceholder,
    ]);

    // Call API
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage], // include latest user message
        selectedPersona,
        selectedMood,
        ...(customTraits && { customTraits }),
      }),
    });

    const data = await response.json();

    const assistantMessage = {
      id: Date.now().toString(), // Generate a unique ID
      role: "assistant" as const,
      content: data.content,
    };

    setMessages((prevMessages) =>
      prevMessages
        .filter((msg) => msg.id !== "typing-placeholder")
        .concat(assistantMessage)
    );
  };

  // Scroll on new messages
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
      <div className={`flex flex-col h-[85vh] justify-between mt-4`}>
        <div
          ref={messageContainerRef}
          className={`flex-1 basis-auto overflow-y-auto h-[100px] hide-scrollbar`}
        >
          {/* Empty chat message */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-4xl text-white animate-slideUp delay-1000">
              Hi, I'm here for you 🤗
            </div>
          )}
          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="px-4 py-2"
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mb-[40px]">
          <InputBox
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            handleDirectSubmit={handleDirectSubmit}
            input={input}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

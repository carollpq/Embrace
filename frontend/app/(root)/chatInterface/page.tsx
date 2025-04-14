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
      selectedMood
    },
    onResponse: async (response) => {
      try {
        const jsonResponse = await response.json(); // Parse the API response

        // Remove the typing placeholder
        setMessages((prev) =>
          prev.filter(
            (msg) => msg.role !== "assistant" || msg.content !== "__typing__"
          )
        );

        if (jsonResponse?.content) {
          // Delay assistant message by 500ms
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, jsonResponse]);
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing the response:", error);
      }
    },
  });

  //Add typing animation message after user sends input (overriding the original function)
  const handleSubmit = async (e: any) => {
    await originalHandleSubmit(e);

    // Immediately show typing animation placeholder
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(), // or crypto.randomUUID() for uniqueness
          role: "assistant",
          content: "__typing__",
        },
      ]);
    }, 1000);
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ChatMessage message={message} key={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mb-[40px]">
          <InputBox
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            input={input}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "ai/react";
import { useRef, useLayoutEffect, useEffect } from "react";
import { useSession } from "@/context/Provider";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null); // Reference for the messages container
  const { selectedPersona, customTraits, selectedMood, session } = useSession();
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
    // onResponse: async (response) => {
    //   try {
    //     const jsonResponse = await response.json();

    //     if (jsonResponse?.content) {
    //       setMessages((prevMessages) => {
    //         const filtered = prevMessages.filter(
    //           (msg) => msg.role !== "assistant" || msg.content !== "__typing__"
    //         );
    //         return [...filtered, jsonResponse];
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error parsing the response:", error);
    //   }
    // },
  });

  //Add typing animation message after user sends input (overriding the original function)
  const handleSubmit = async (e?: any) => {
    if (e?.preventDefault) e.preventDefault();

    const typingId = `typing-${Date.now()}`;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: typingId,
        role: "assistant",
        content: "__typing__",
      },
    ]);

    await originalHandleSubmit(e || { target: { value: input } });
  };

  const handleDirectSubmit = async (text: string) => {
    const typingId = `typing-${Date.now()}`;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: text,
    };

    const typingPlaceholder = {
      id: typingId,
      role: "assistant" as const,
      content: "__typing__",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage, typingPlaceholder];

      fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter(
            (m) => m.role !== "assistant" || m.content !== "__typing__"
          ),
          selectedPersona,
          selectedMood,
          ...(customTraits && { customTraits }),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const assistantMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content: data.content,
          };

          setMessages((latest) =>
            latest.filter((msg) => msg.id !== typingId).concat(assistantMessage)
          );
        })
        .catch((err) =>
          console.error("Error fetching assistant response:", err)
        );

      return updatedMessages;
    });
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

  useEffect(() => {
    const initiateChatFromMood = async () => {
      if (messages.length === 0 && selectedMood && moodToPrompt[selectedMood]) {
        const moodMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content: moodToPrompt[selectedMood],
        };

        setMessages([moodMessage]);

        // Add typing placeholder
        setMessages((prev) => [
          ...prev,
          {
            id: "typing-placeholder",
            role: "assistant",
            content: "__typing__",
          },
        ]);

        try {
          const res = await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [moodMessage],
              selectedPersona,
              selectedMood,
              ...(customTraits && { customTraits }),
            }),
          });

          const data = await res.json();

          const assistantMessage = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: data.content,
          };

          // Replace typing with actual assistant reply
          setMessages((prev) =>
            prev
              .filter((m) => m.id !== "typing-placeholder")
              .concat(assistantMessage)
          );
        } catch (err) {
          console.error("Failed to fetch Gemini greeting:", err);
        }
      }
    };

    initiateChatFromMood();
  }, [messages.length, selectedMood, selectedPersona, customTraits]);

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

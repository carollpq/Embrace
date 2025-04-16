"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "ai/react";
import { useRef, useLayoutEffect, useEffect } from "react";
import { useSession } from "@/context/Provider";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { selectedPersona, customTraits, selectedMood, session } = useSession();
  const router = useRouter();
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
    onResponse: async (response) => {
      try {
        const jsonResponse = await response.json();

        if (jsonResponse?.content) {
          setTimeout(() => {
            setMessages((prevMessages) => {
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
  
  // Re-directs user to login if session expires
  useEffect(() => {
    if (session === null) {
      toast.error("Your session has expired. Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 2000); // wait 2 seconds so user can read the message
    }
  }, [session]);

  // Warns user before refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages]);

  // 🧠 Mood-based introduction (only triggers once at beginning)
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

        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [introMessage],
            selectedPersona,
            selectedMood,
            ...(customTraits && { customTraits }),
          }),
        });

        const data = await response.json();

        const assistantMessage = {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: data.content,
        };

        setMessages([introMessage, assistantMessage]);
      }
    };

    sendIntroFromMood();
  }, [messages.length, selectedMood, selectedPersona, customTraits]);

  const handleSubmit = async (e?: any) => {
    if (e?.preventDefault) e.preventDefault();
    originalHandleSubmit(e || { target: { value: input } });

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

    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        selectedPersona,
        selectedMood,
        ...(customTraits && { customTraits }),
      }),
    });

    const data = await response.json();

    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: data.content,
    };

    setMessages((prevMessages) =>
      prevMessages
        .filter((msg) => msg.id !== "typing-placeholder")
        .concat(assistantMessage)
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
    <div className="relative">
      <div className="flex flex-col h-[85vh] justify-between mt-4">
        <div
          ref={messageContainerRef}
          className="flex-1 basis-auto overflow-y-auto h-[100px] hide-scrollbar"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-4xl text-white animate-slideUp delay-1000">
              Hi, I'm here for you 🤗
            </div>
          )}
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

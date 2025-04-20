"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useRef, useLayoutEffect, useEffect, FormEvent } from "react";
import { useSession } from "@/context/Provider";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  } = useSession();

  const router = useRouter();

  const moodToPrompt: Record<string, string> = {
    Anxious: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm feeling anxious.`,
    Sad: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm feeling really sad today.`,
    Angry: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm angry about something that happened.`,
    Happy: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm in a happy mood today!`,
    Neutral: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm feeling okay, nothing in particular.`,
    Stressed: `Hey there, ${session ? `I'm ${session.name}.` : ""} I'm stressed and overwhelmed.`,
  };

  // Redirect if session expired
  useEffect(() => {
    if (session === null) {
      toast.error("Your session has expired. Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [session]);

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

  // ✍️ Handle text submit
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e?.preventDefault) e.preventDefault();

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
      prev.filter((msg) => msg.id !== "typing-placeholder").concat({
        id: Date.now().toString(),
        role: "assistant" as const,
        content: data.content,
      })
    );
  };

  // 🎤 Handle voice input
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
      prev.filter((msg) => msg.id !== "typing-placeholder").concat({
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
                <ChatMessage message={message} />
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
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

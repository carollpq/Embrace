"use client";

import "../../globals.css";
import { Quicksand } from "next/font/google";
import ChatHeader from "@/components/ui/ChatHeader";
import Sidebar from "@/components/ui/Sidebar";
import React, { useState, createContext, useContext } from "react";

const quicksand = Quicksand({ weight: ["400"], subsets: ["latin"] });

export type Message = {
  role: "user" | "model";
  content: string;
};

interface ChatContextProps {
  messages: Message[];
  loading: boolean;
  loadChatThread: (threadId: string) => void;
}

const ChatContext = createContext<
  ChatContextProps & { setMessages: React.Dispatch<React.SetStateAction<Message[]>> } | undefined
>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to manage chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to load a specific chat thread
  const loadChatThread = async (threadId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chatbot/getChatById?threadId=${threadId}`);
      const data = await res.json();
      if (data?.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading chat thread:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, loading, loadChatThread }}>
      <main
        className={`${quicksand.className} bg-home-screen-blue bg-black/40 flex flex-row h-screen w-screen justify-between`}
      >
        <Sidebar onLoadChat={loadChatThread}/>
        <div className="flex flex-col w-full h-screen">
          <ChatHeader />
          {children}
        </div>
      </main>
    </ChatContext.Provider>
  );
}

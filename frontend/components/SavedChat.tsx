"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface ChatThread {
  id: string;
  title: string; // Optional: You can generate titles based on the first message or a user-provided name.
  lastUpdated: string; // Optional: Use timestamps to sort and display threads.
}

const SavedChat = ({ onLoadChat }: { onLoadChat: (threadId: string) => void }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChatThreads = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chatbot/getChats?userId=${userId}`);
        const data = await res.json();
        if (data?.chatThreads) {
          setChatThreads(data.chatThreads);
        }
      } catch (error) {
        console.error("Error fetching chat threads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThreads();
  }, [userId]);

  return (
    <div className="flex flex-col gap-4">
      {loading && <span>Loading chats...</span>}
      {!loading && chatThreads.length === 0 && <span>No saved chats yet</span>}
      {chatThreads.map((thread) => (
        <div
          key={thread.id}
          className="bg-[#021017]/80 button-transition rounded-lg drop-shadow-md text-left py-2 px-6 hover:bg-white/50 hover:text-black hover:cursor-pointer"
          onClick={() => onLoadChat(thread.id)}
        >
          {thread.title || `Chat started on ${new Date(thread.lastUpdated).toLocaleDateString()}`}
        </div>
      ))}
    </div>
  );
};

export default SavedChat;

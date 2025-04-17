"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/Provider";

type SavedMessage = {
  _id: string;
  content: string;
  savedAt: string;
  note?: string;
};

const SavedMessages = () => {
  const { session } = useSession();
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedMessages = async () => {
      if (!session?.email) return;

      try {
        const res = await fetch(`/api/get-saved-messages?userId=${session.email}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to fetch saved messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMessages();
  }, [session?.email]);

  if (loading) {
    return (
      <div className="text-white text-lg p-6">Loading saved messages...</div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-white text-lg p-6">No saved messages yet.</div>
    );
  }

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="bg-white/80 text-black rounded-xl px-4 py-3 shadow-md relative"
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>
          {msg.note && (
            <p className="text-sm italic text-gray-600 mt-1">Note: {msg.note}</p>
          )}
          <span className="absolute top-2 right-3 text-xs text-gray-500">
            {new Date(msg.savedAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SavedMessages;

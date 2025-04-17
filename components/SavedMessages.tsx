import { useEffect, useState } from "react";
import { useSession } from "@/context/Provider";
import Image from "next/image";

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
        const res = await fetch(
          `/api/get-saved-messages?userId=${session.email}`
        );
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/delete-saved-message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: id, userId: session?.email }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
        <h2 className="text-3xl font-medium text-white/70 animate-slideUp delay-1000">
          Loading saved messages ...
        </h2>
        {/* Spinning Loader */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-screen">
        <h2 className="text-3xl font-medium text-white/70 animate-slideUp delay-1000">
          No Saved Messages
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-screen p-10">
      <h2 className="text-3xl font-medium text-white/70 ">Saved Messages</h2>
      <div className="max-w-[80%] overflow-y-auto space-y-4 animate-slideUp delay-1000">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white/80 text-black rounded-xl px-4 py-3 shadow-md relative "
          >
            <p className="whitespace-pre-wrap p-8">{msg.content}</p>
            {msg.note && (
              <p className="text-sm italic text-gray-600">Note: {msg.note}</p>
            )}
            <span className="absolute top-5 right-5 text-xs text-gray-500">
              {new Date(msg.savedAt).toLocaleString()}
            </span>

            {/* 🗑 Delete icon */}
            <button
              onClick={() => handleDelete(msg._id)}
              className="absolute top-5 left-4 hover:text-red-600 text-black/60"
              title="Delete"
            >
              <Image
                src="/icons/trash-icon.svg"
                alt="Delete"
                width={16}
                height={16}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMessages;

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { stopSpeech } from "@/utils/tts/polly";

type SavedMessage = {
  _id: string;
  content: string;
  savedAt: string;
  note?: string;
};

const SavedMessages = () => {
  const { user } = useSession();
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null); // Track the message being deleted

  useEffect(stopSpeech, []);
  
  useEffect(() => {
    const fetchSavedMessages = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(
          `/api/get-saved-messages?userId=${user.email}`
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
  }, [user?.email]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingMessageId(id); // Set the message being deleted
      const res = await fetch("/api/delete-saved-message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: id, userId: user?.email }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeletingMessageId(null); // Reset when done
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-[85vh]">
        <h2 className="sm:text-3xl text-2xl font-medium text-white/70 animate-slideUp delay-1000">
          Loading saved messages ...
        </h2>
        <div className="sm:w-12 sm:h-12 w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin delay-1000 mt-3"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-[85vh]">
        <h2 className="sm:text-3xl text-2xl font-medium text-white/70 animate-slideUp delay-1000">
          No Saved Messages
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-[85vh] p-2 sm:pl-16">
      <h2 className="sm:text-3xl text-2xl font-medium text-white ">Saved Messages</h2>
      <div className="sm:max-w-[60%] w-full overflow-y-auto space-y-4 animate-slideUp delay-1000">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white/80 text-black rounded-xl px-4 py-3 shadow-md relative"
          >
            {deletingMessageId === msg._id ? ( // If the message is being deleted
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <h3 className="text-sm text-gray-600 mt-2">Deleting...</h3>
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mt-3"></div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap p-8">{msg.content}</p>
                {msg.note && (
                  <p className="text-sm italic text-gray-600">Note: {msg.note}</p>
                )}
                <span className="absolute top-5 right-5 text-xs text-black/80">
                  {new Date(msg.savedAt).toLocaleString()}
                </span>

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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMessages;

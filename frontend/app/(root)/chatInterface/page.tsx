"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat, Message } from "./layout";
//import { useAuth } from "@/context/AuthContext";

const ChatInterface: React.FC = () => {

  const { messages, setMessages, loading, loadChatThread } = useChat();
  //const { user } = useAuth(); // Access the user object from AuthContext
  //const currentUserId = user?.id; // Get the user ID from the user object

  const testUserId = "6725fb55b7688db72cc78c69";
  const onSubmitMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    // if (!user) {
    //   console.error("User is not logged in");
    //   return;
    // }
  
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: testUserId, // Pass the current user's ID
          userMessage: message,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        const botMessage: Message = { role: "model", content: data.response };
        console.log(data.response);
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error from API:", data.error);
      }
    } catch (error) {
      console.error("Failed to submit message:", error);
    }
  };
  
  return (
    <div className="flex flex-col h-[85vh] justify-between mt-4">
      <div className="flex-1 basis-auto overflow-y-auto h-[100px]">
        {messages && messages.map((m, i) => <ChatMessage {...m} key={i} />)}
      </div>
      <div className="mb-[40px]">
        <InputBox
          handleSubmit={onSubmitMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;

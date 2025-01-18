"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { useSession } from "@/context/Provider";

const ChatInterface: React.FC = () => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null); // Reference for the messages container

  const { selectedPersona } = useSession();

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: 'api/chatbot',
    body: {selectedPersona},
    onResponse: async (response) => {
      try {
        const jsonResponse = await response.json(); // Parse the API response

        if (jsonResponse?.content) {
          setMessages((prevMessages) => [
            ...prevMessages,
            jsonResponse
          ]);
        }
      } catch (error) {
        console.error("Error parsing the response:", error);
      }
    },
  });

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col h-[85vh] justify-between mt-4">
      <div 
        ref={messageContainerRef}
        className="flex-1 basis-auto overflow-y-auto h-[100px] hide-scrollbar"
      >
        {messages && messages.map((message, index) => <ChatMessage message={message} key={index} />)}
      </div>
      <div className="mb-[40px]">
        <InputBox
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
        />
      </div>
    </div>
  );
};

export default ChatInterface;

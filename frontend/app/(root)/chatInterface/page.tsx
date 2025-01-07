"use client";

import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "ai/react";

const ChatInterface: React.FC = () => {

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: 'api/chatbot',
    onResponse: async (response) => {
      try {
        const jsonResponse = await response.json(); // Parse the API response
        console.log("Parsed API Response:", jsonResponse);

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

  // Debugging: Log messages to see if they are being updated
  console.log("Current messages:", messages);
  
  return (
    <div className="flex flex-col h-[85vh] justify-between mt-4">
      <div className="flex-1 basis-auto overflow-y-auto h-[100px] hide-scrollbar">
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

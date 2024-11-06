"use client";

import { useState } from "react";
import InputBox from "@/components/InputBox";
import ChatMessage from "@/components/ChatMessage";
import { chatCompletion } from "@/actions";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const ChatInterface = ({ getChatSessions }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, how may I help you?" },
  ]);

  // Handle message submission
  const handleSubmit = async (message: string) => {

    console.log('USER MESSAGE', message);

    if (!message) return;

    // Create new message object
    const newMessage: Message = {role: 'user', content: message};
    console.log("NEW MESSAGE", newMessage);

    // Update the message state
    setMessages((prevMessage) => [...prevMessage, newMessage]);
    setLoading(true);

    // Request to OPENAI
    try {
      // copy of messages
      const chatMessages = messages.slice(1);
      console.log('CHAT MESSAGES', chatMessages);

      // Call the chat completion API
      const res = await chatCompletion([...chatMessages, newMessage]);
      console.log('RESPONSE', res);

      // Handle response
      if (res?.choices[0]?.message) {
        const assistantMessage: Message = {
          content: res.choices[0].message.content as string,
          role: 'assistant'
        }

        setMessages(prevMessages => [...prevMessages, assistantMessage])
      }

    } catch (error) {
      console.error("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] justify-between mt-4">
      <div className="flex-1 basis-auto overflow-y-auto h-[100px]">
        {messages && messages.map((m, i) => <ChatMessage {...m} key={i} />)}
      </div>

      <div className="mb-[40px]">
        <InputBox
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatInterface;

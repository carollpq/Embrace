import OpenAI from "openai";
import { Message } from "@/app/(root)/chatInterface/page";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function chatCompletion(chatMessages: Message[]) {
  console.log("FROM BACKEND", chatMessages);

  const chat = [
    {
      role: "system",
      content:
        "You are an empathetic, kind, caring, warm, and understanding therapist that is ready to listen and offer support to someone in need",
    },
    ...chatMessages,
  ];

  const completion = await openAI.chat.completions.create({
    messages: chat,
    model: "gpt-4o-mini",
  });

  console.log('COMPLETION', completion.choices[0]);
  return completion;
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { saveOrUpdateChatThread, getLatestChatThread, getAllChatThreads, getChatThreadById } from "../../../utils/config/dbConfig";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction:
    "You are someone empathetic and comforting that people can talk to you to about their problems. Doesn't matter the age group or the background of the people, what kind of mental disorders they are facing, you are ready to listen and help them through their emotions and calm them down. Your warm energy can make them open up easily. You have a personality. You don't just give a generic therapist like responses. Give a warm, empathetic, calm energy when they reply. Don't make the initial reply too long",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1192,
};

// Hanle POST requests
export async function POST(request: Request) {
  try {
    const body =  await request.json();
    const { userId, userMessage } = body;

    if (!userId || !userMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const latestThread = await getLatestChatThread(userId);
    const chatHistory = latestThread?.messages || [];

    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }], // Wrap message content
      })),
    });

    const response = await chatSession.sendMessage(userMessage);

    if (!response || !response.response?.text) {
      return NextResponse.json({ error: "Failed to generate a response." }, { status: 500 });
    }

    const modelMessage = { sender: "model", content: response.response.text };

    const updatedMessages: { sender: "model" | "user"; content: string }[] = [
      ...chatHistory.map((msg) => ({
        sender: msg.sender === "user" || msg.sender === "model" ? msg.sender : "user", // Validate sender
        content: typeof msg.content === "string" ? msg.content : "",
      })),
      { sender: "user", content: userMessage },
      { sender: "model", content: response.response.text() },
    ];
    await saveOrUpdateChatThread(userId, updatedMessages);

    return NextResponse.json({ response: modelMessage.content }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// Handle GET requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const threadId = searchParams.get("threadId");

    if (!userId) {
      return NextResponse.json({ error: "Missing required userId" }, { status: 400 });
    }

    if (threadId) {
      const chatThread = await getChatThreadById(threadId);
      if (!chatThread) {
        return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
      }
      return NextResponse.json(chatThread, { status: 200 });
    }

    const chatThreads = await getAllChatThreads(userId);
    return NextResponse.json(chatThreads, { status: 200 });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




import { getModel } from "@/utils/geminiClient";

export const runtime = "edge";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1192,
};

// Hanle POST requests
export default async function POST(req: Request) {
  try {
    const { messages, selectedPersona, customTraits, mood } = await req.json();
    const model = getModel(
      selectedPersona as "Jenna" | "Marcus",
      customTraits ?? null,
      mood ?? "",
    );

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid payload: 'messages' must be an array." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatHistory = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const userMessage = messages[messages.length - 1]?.content || "Hello"; // Last user message
    const result = await chatSession.sendMessage(userMessage);

    const modelMessage = { 
      role: "assistant", 
      content: result.response.text()
    };

    return new Response(JSON.stringify(modelMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });


  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};





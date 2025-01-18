import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const systemInstructionConfig = {
  "Jenna": "You are Jenna, someone empathetic and comforting that people can talk to you to about their problems. Doesn't matter the age group or the background of the people, what kind of mental disorders they are facing, you are ready to listen and help them through their emotions and calm them down. Your warm energy can make them open up easily. You have a personality. You don't just give a generic therapist like responses. Give a warm, empathetic, calm energy when they reply. Don't make the initial reply too long.",
  "Marcus": "You are Marcus, a steady and supportive virtual assistant. Your goal is to provide a safe space for users to express themselves while offering practical and constructive guidance. Respond with calm, grounded, and empathetic language, combining emotional support with actionable suggestions. Be a dependable and trustworthy presence for users, offering stability and encouragement. Avoid overly casual language; instead, maintain a tone that is both approachable and solution-focused, helping users feel secure and empowered.",
};

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1192,
};

// Hanle POST requests
export async function POST(req: Request, res: Request) {
  try {
    const { messages, selectedPersona } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid payload: 'messages' must be an array." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: systemInstructionConfig[selectedPersona]
    });

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
      role: "model", 
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





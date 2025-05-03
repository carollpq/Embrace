import { getModel } from "@/utils/geminiClient";
import { isCrisisMessage } from "@/utils/crisisDetector";

export const runtime = "edge";

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 20,
  maxOutputTokens: 500,
};

// Hanle POST requests
export async function POST(req: Request) {
  try {
    const { messages, selectedPersona, customTraits, mood } = await req.json();
    const model = getModel(
      selectedPersona as "Jenna" | "Marcus",
      customTraits ?? null,
      mood ?? ""
    );

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid payload: 'messages' must be an array.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const chatHistory = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const userMessage = messages[messages.length - 1]?.content || "Hello";

    // ✅ Crisis message check before calling Gemini
    if (isCrisisMessage(userMessage)) {
      const crisisResponse = `
It sounds like you're going through something really heavy. You're not alone, and support is available. 💛

If you're in Malaysia, here are people you can talk to:
- Befrienders KL: 03-7627 2929 (24/7, free, confidential)
- Naluri (General Mental Health Support): 0384081748
- MIASA (Mental Illness Awareness): 1800 180 066 or WhatsApp 03-9765 6088
- WAO (Domestic Violence Support): 03-3000 8858 or WhatsApp 018-988 8058

Please reach out — your well-being matters.

      `.trim();

      return new Response(
        JSON.stringify({
          role: "assistant",
          content: crisisResponse,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Regular Gemini generation
    const result = await chatSession.sendMessage(userMessage);
    const modelMessage = {
      role: "assistant",
      content: result.response.text(),
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
}

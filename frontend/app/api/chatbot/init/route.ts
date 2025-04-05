import { getModel } from "@/utils/geminiClient";

export async function GET() {
  try {
    // Preload both personas so whichever they choose is ready
    getModel("Jenna");
    getModel("Marcus");

    return new Response(JSON.stringify({ message: "Gemini initialized" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to init Gemini:", error);
    return new Response(JSON.stringify({ error: "Initialization failed" }), {
      status: 500,
    });
  }
}
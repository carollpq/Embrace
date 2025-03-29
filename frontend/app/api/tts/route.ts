import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    // Coqui command (modify the path if needed)
    const command = `coqui-tts --text "${text}" --out_path "./public/audio/output.wav" --model_name "tts_models/en/ljspeech/tacotron2-DDC"`;

    await new Promise<void>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Coqui: ${error.message}`);
          reject(error);
        } else {
          console.log(`Coqui Output: ${stdout}`);
          resolve();
        }
      });
    });

    return NextResponse.json({ url: "/audio/output.wav" });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

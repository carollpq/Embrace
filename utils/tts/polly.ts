/* eslint-disable react/no-unescaped-entities */
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID! || "AKIATJHQD2HBDTZTB2EN",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! || "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",
  },
});

async function convertAudioStreamToUint8Array(stream: any): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function getSpeech(text: string, voiceId = "Danielle") {
  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voiceId,
    Engine: "generative", // Use 'standard' for non-Neural voices if needed
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await pollyClient.send(command);

    if (!data.AudioStream) {
      throw new Error("AudioStream is undefined");
    }

    const audioData = await convertAudioStreamToUint8Array(data.AudioStream);
    return audioData;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
}

let currentAudio: HTMLAudioElement | null = null;

export async function playSpeech(text: string, voiceId = "Danielle") {
  const audioStream = await getSpeech(text, voiceId);

  const audioBlob = new Blob([audioStream], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);

  // Stop and cleanup any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  currentAudio = new Audio(audioUrl);

  currentAudio.onended = () => {
    currentAudio = null; // Reset after playback ends
  };

  currentAudio.play().catch((err) => {
    console.error("Audio playback failed:", err);
    currentAudio = null;
  });
}

// Persona-specific speech
const personaVoices = {
  Jenna: "Danielle",
  Marcus: "Matthew",
};

export async function playPersonaSpeech(text: string, persona: string | null) {
  const voiceId = personaVoices[persona];
  if (!voiceId) {
    console.error(`Voice ID not found for persona: ${persona}`);
    return;
  }
  await playSpeech(text, voiceId); // Ensure this is awaited
}

export default pollyClient;

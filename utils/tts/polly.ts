/* eslint-disable react/no-unescaped-entities */
import {
  PollyClient,
  SynthesizeSpeechCommand,
  Engine,
  OutputFormat,
  VoiceId,
} from "@aws-sdk/client-polly";

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID! || "AKIATJHQD2HBDTZTB2EN",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY! ||
      "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",
  },
});

/**
 * Converts the audio stream from Polly into a usable format
 */
async function convertAudioStreamToUint8Array(
  stream: any
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Calls Polly to synthesize speech from text
 */

export async function getSpeech(text: string, voiceId = "Danielle") {
  const params = {
    OutputFormat: "mp3" as OutputFormat,
    Text: text,
    VoiceId: voiceId as VoiceId,
    Engine: "generative" as Engine, // Use 'standard' for non-Neural voices if needed
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

// Keep reference to currently playing audio for control
let currentAudio: HTMLAudioElement | null = null;

/**
 * Stops any active Polly playback
 */
export function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; // Reset playback position to the beginning
    currentAudio = null; // Clear currentAudio reference
  }
}

/**
 * Plays synthesized speech using HTMLAudioElement
 */
export async function playSpeech(
  text: string,
  voiceId = "Danielle",
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
) {
  const audioStream = await getSpeech(text, voiceId);
  const audioBlob = new Blob([audioStream], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);

  // Stop and cleanup any currently playing audio
  stopSpeech();

  const audio = new Audio(audioUrl);
  if (audioRef) audioRef.current = audio;

  audio.onended = () => {
    if (audioRef) audioRef.current = null;
    onEnd?.();
  };

  onStopLoad?.();
  onStart?.();

  try {
    await audio.play();
  } catch (err) {
    console.error("Audio playback failed:", err);
    if (audioRef) audioRef.current = null;
    onEnd?.();
  }
}

/**
 * Maps personas to Polly voices
 */
const personaVoices = {
  Jenna: "Danielle",
  Marcus: "Matthew",
};

/**
 * High-level function to play Polly speech for a persona
 */
export async function playPersonaSpeech(
  text: string,
  persona: string | null,
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
) {
  if (!persona || !(persona in personaVoices)) {
    console.error(`Voice ID not found for persona: ${persona}`);
    return;
  }

  const voiceId = personaVoices[persona as keyof typeof personaVoices];
  await playSpeech(text, voiceId, audioRef, onEnd, onStart, onStopLoad);
}

export default pollyClient;

/* eslint-disable react/no-unescaped-entities */
import {
  PollyClient,
  SynthesizeSpeechCommand,
  Engine,
  OutputFormat,
  VoiceId,
} from "@aws-sdk/client-polly";

type Persona = "Jenna" | "Marcus";

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID! || "AKIATJHQD2HBDTZTB2EN",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY! ||
      "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",
  },
});

// Global reference for audio control
let currentAudio: HTMLAudioElement | null = null;

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

/**
 * Stops any active Polly playback
 */
export function stopSpeech() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeAttribute('src'); // Prevent memory leaks
      if (currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.src);
      }
    } catch (e) {
      console.warn("Error stopping audio:", e);
    } finally {
      currentAudio = null;
    }
  }
}

/**
 * Plays synthesized speech using HTMLAudioElement
 */
export async function playSpeech(
  text: string,
  voiceId: VoiceId = "Danielle",
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
): Promise<void> {
  // Clean up previous audio
  stopSpeech();

  try {
    const audioStream = await getSpeech(text, voiceId);
    const audioBlob = new Blob([audioStream], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    if (audioRef) audioRef.current = audio;

    // Setup event handlers
    const cleanup = () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleError);
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
    };

    const handleEnd = () => {
      cleanup();
      onEnd?.();
    };

    const handleError = (err: ErrorEvent) => {
      console.error("Audio playback error:", err);
      cleanup();
      onEnd?.();
    };

    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleError);

    // Mobile browsers require this to be called from a user gesture
    try {
      onStopLoad?.();
      onStart?.();
      await audio.play();
    } catch (playError) {
      console.error("Initial play failed (may need user interaction):", playError);
      // On mobile, we might need to show a "Tap to play" button
      throw playError;
    }
  } catch (error) {
    console.error("Speech playback failed:", error);
    stopSpeech();
    throw error;
  }
}

/**
 * Maps personas to Polly voices
 */
const personaVoices: Record<Persona, VoiceId> = {
  Jenna: "Danielle",
  Marcus: "Matthew",
};

/**
 * High-level function to play Polly speech for a persona
 */
export async function playPersonaSpeech(
  text: string,
  persona: string | Persona | null,
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>,
  onEnd?: () => void,
  onStart?: () => void,
  onStopLoad?: () => void
): Promise<void> {
  // Type guard to check valid persona
  const isValidPersona = (p: string | null): p is Persona => {
    return p !== null && p in personaVoices;
  };

  if (!isValidPersona(persona)) {
    const validOptions = Object.keys(personaVoices).join(", ");
    console.error(`Invalid persona "${persona}". Valid options: ${validOptions}`);
    throw new Error(`Unsupported persona. Valid options: ${validOptions}`);
  }
  
  if (!persona || !personaVoices[persona]) {
    console.error(`No voice mapped for persona: ${persona}`);
    throw new Error(`Unsupported persona: ${persona}`);
  }

  try {
    await playSpeech(
      text,
      personaVoices[persona],
      audioRef,
      onEnd,
      onStart,
      onStopLoad
    );
  } catch (error) {
    console.error(`Failed to play speech for persona ${persona}:`, error);
    throw error;
  }
}

// Utility function to preload audio (useful for mobile)
export async function preloadPersonaAudio(text: string, persona: Persona): Promise<string> {
  try {
    const audioStream = await getSpeech(text, personaVoices[persona]);
    const audioBlob = new Blob([audioStream], { type: "audio/mpeg" });
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Preload failed:", error);
    throw error;
  }
}

export default pollyClient;

export async function playCoquiSpeech(text: string) {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("TTS API request failed");

    const { url } = await response.json();

    const audio = new Audio(url);
    audio.play();
  } catch (error) {
    console.error("Error playing Coqui speech:", error);
  }
}

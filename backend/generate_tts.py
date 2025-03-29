import sys
from TTS.api import TTS
import os

def generate_speech(text, output_file="output.wav"):
    # Load a model (you can replace it with a different model)
    tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False).to("cpu")

    # Generate speech and save to file
    tts.tts_to_file(text=text, file_path=output_file)

if __name__ == "__main__":
    text = sys.argv[1]  # Get text from command line
    output_file = "public/output.wav"  # Save file in Next.js public folder
    generate_speech(text, output_file)
    print("Speech generated successfully!")
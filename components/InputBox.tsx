"use client";

import style from "../styles/InputBox.module.css";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSession } from "@/context/Provider";
import HelpTooltip from "@/components/ui/HelpTooltip";

const InputBox = ({
  handleSubmit,
  handleInputChange,
  handleDirectSubmit,
  input,
}: {
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDirectSubmit: (transcript: string) => void;
  input: string;
}) => {
  const inputBoxTextArea = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const { selectedMode, selectedPersona, showHelp } = useSession();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const hasSubmittedRef = useRef(false);

  // Handle Enter key for text mode
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // 🎤 Toggle STT
  const handleSTT = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      hasSubmittedRef.current = false; // reset before starting
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setIsListening(true);
    }
  };

  // Automatically submit when STT ends
  useEffect(() => {
    if (!listening && transcript.trim() && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;

      handleInputChange({
        target: { value: transcript },
      } as React.ChangeEvent<HTMLTextAreaElement>);

      handleDirectSubmit(transcript);
      setIsListening(false);
    }
  }, [listening, transcript]);

  // Stops speech upon unload
  useEffect(() => {
    const handleUnload = () => {
      SpeechRecognition.stopListening(); // Stop listening (STT)
      window.speechSynthesis.cancel(); // Stop speaking (Browser TTS)
      // stop Polly if you're using it — need access to audio ref
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, []);

  return (
    <div
      className={`${style["chat-input-holder"]} ${
        showHelp ? "pointer-events-none" : ""
      }`}
    >
      {/* Voice mode */}
      {selectedMode === "voice-and-text" ||
      selectedMode === "voice-and-voice" ? (
        <div className="flex flex-col justify-center items-center gap-6">
          <span className="text-xl">
            Click here and start speaking with {selectedPersona}!
          </span>
          <button
            type="button"
            onClick={handleSTT}
            className={`${style["chat-svg-container"]} ${
              isListening ? style["listening"] : ""
            }`}
            style={{ marginRight: "8px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={isListening ? style["mic-animate"] : ""}
            >
              <path
                fill={isListening ? "red" : "currentColor"}
                d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72m-8.2-6.1c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2s-1.2-.54-1.2-1.2M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          {/* Text box */}
          <textarea
            autoFocus
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={input}
            rows={1}
            className={`${style["chat-input-textarea"]} ${
              showHelp ? "textbox-highlight-glow z-20" : ""
            }`}
            placeholder="Send a message..."
            ref={inputBoxTextArea}
          />

          {/* Send button */}
          <div
            className={`${style["chat-svg-container"]} ${
              showHelp ? "textbox-highlight-glow z-20" : ""
            }`}
            onClick={handleSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="none"
            >
              <path
                fill="#fff"
                d="M2.816 7.988c-.514.215-.833.6-.838 1.143-.004.38.253.89.767 1.1.212.085 3.184.485 3.184.485s.786 2.487 1.07 3.36c.082.253.129.377.309.542.305.28.822.192 1.045-.032.592-.593 1.526-1.507 1.526-1.507l.393.32s1.746 1.393 2.701 2.049c.562.386.952.79 1.585.792.322.001.839-.16 1.18-.55.226-.258.371-.672.427-1.042.127-.842 1.622-9.94 1.615-10.26a.8.8 0 0 0-.792-.79c-.224.002-.407.067-.817.192-3.164.966-13.146 4.11-13.355 4.198Zm11.804-2.02s-4.17 3.63-5.837 5.3c-.534.535-.572 1.453-.572 1.453l-.86-2.756 7.269-3.997Z"
              />
            </svg>
          </div>
        </>
      )}

      {/* Help Tooltip */}
      {(selectedMode === "text-and-text" ||
        selectedMode === "text-and-voice") &&
        showHelp && (
          <HelpTooltip
            text="Type your messages here, click the send button or press enter to send the message"
            className="right-40 bottom-20"
          />
        )}
    </div>
  );
};

export default InputBox;

"use client";

import style from "@/styles/InputBox.module.css";
import { useEffect, useRef } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText"; 
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { TextInputArea } from "@/components/TextInputArea"
import { SendButton } from "@/components/SendButton"
import { useSettings } from "@/context/SettingsContext";
import { useModal } from "@/context/ModalContext";

interface InputBoxProps {
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDirectSubmit: (transcript: string) => void;
  input: string;
  setHasUserTriggeredResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputBox = ({
  handleSubmit,
  handleInputChange,
  handleDirectSubmit,
  input,
  setHasUserTriggeredResponse,
}: InputBoxProps) => {
  const { settings: {mode: selectedMode, persona: selectedPersona }} = useSettings();
  const { showHelp } = useModal();
  const inputBoxTextArea = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    handleSTT,
    browserSupportsSpeechRecognition,
  } = useSpeechToText({
    handleDirectSubmit,
    handleInputChange,
    setHasUserTriggeredResponse,
  });

  // Cleanup on unmount
  useEffect(() => {
    const handleUnload = () => {
      window.speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, []);

  const isVoiceMode = selectedMode === "voice-and-text" || 
                      selectedMode === "voice-and-voice";

  return (
    <div className={style["chat-input-holder"]}>
      {isVoiceMode ? (
        <div className="flex flex-col justify-center items-center gap-6">
          <span className="sm:text-xl text-lg text-center">
            Click here and start speaking with {selectedPersona}!
          </span>
          <VoiceInputButton 
            isListening={isListening} 
            onClick={handleSTT} 
            disabled={!browserSupportsSpeechRecognition}
          />
        </div>
      ) : (
        <>
          <TextInputArea
            ref={inputBoxTextArea}
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            setHasUserTriggeredResponse={setHasUserTriggeredResponse}
            showHelp={showHelp}
          />
          <SendButton onClick={handleSubmit} showHelp={showHelp} />
        </>
      )}
    </div>
  );
};

export default InputBox;
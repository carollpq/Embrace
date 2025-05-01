"use client";

import style from "@/styles/InputBox.module.css";
import { useEffect, useRef } from "react";
import { useSession } from "@/context/Provider";
import HelpTooltip from "@/components/ui/HelpTooltip";
import { useSpeechToText } from "@/hooks/useSpeechToText"; 
import { VoiceInputButton } from "./VoiceInputButton";
import { TextInputArea } from "./TextInputArea";
import { SendButton } from "./SendButton";

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
  const { selectedMode, selectedPersona, showHelp } = useSession();
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
    <div className={`${style["chat-input-holder"]} ${showHelp ? "pointer-events-none" : ""}`}>
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

      {!isVoiceMode && showHelp && (
        <HelpTooltip
          text="Type your messages here, click the send button or press enter to send the message"
          className="right-40 bottom-20"
        />
      )}
    </div>
  );
};

export default InputBox;
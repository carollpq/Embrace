import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const useSpeechToText = ({
  handleDirectSubmit,
  handleInputChange,
  setHasUserTriggeredResponse,
}: {
  handleDirectSubmit: (transcript: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setHasUserTriggeredResponse: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isListening, setIsListening] = useState(false);
  const hasSubmittedRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSTT = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      hasSubmittedRef.current = false;
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setIsListening(true);
    }
  };

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  useEffect(() => {
    if (!listening && transcript.trim() && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      setHasUserTriggeredResponse(true);
      handleInputChange({
        target: { value: transcript },
      } as React.ChangeEvent<HTMLTextAreaElement>);
      handleDirectSubmit(transcript);
    }
  }, [listening, transcript]);

  return {
    isListening,
    transcript,
    handleSTT,
    browserSupportsSpeechRecognition,
  };
};
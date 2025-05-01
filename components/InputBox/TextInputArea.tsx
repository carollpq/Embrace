import { forwardRef } from "react";
import style from "../styles/InputBox.module.css";

interface TextInputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  setHasUserTriggeredResponse: (value: boolean) => void;
  showHelp?: boolean;
}

export const TextInputArea = forwardRef<HTMLTextAreaElement, TextInputAreaProps>(
  ({ value, onChange, onSubmit, setHasUserTriggeredResponse, showHelp }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        setHasUserTriggeredResponse(true);
        onSubmit();
      }
    };

    return (
      <textarea
        ref={ref}
        autoFocus
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={value}
        rows={1}
        className={`${style["chat-input-textarea"]} ${
          showHelp ? "textbox-highlight-glow z-20" : ""
        }`}
        placeholder="Send a message..."
      />
    );
  }
);

TextInputArea.displayName = "TextInputArea";
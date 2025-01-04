"use client";

import style from "../styles/InputBox.module.css";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

// Define the type for the component props
interface InputBoxProps {
  handleSubmit: (message: string) => void; // Function to handle message submission
}

/** Lives in the lower section of \<ChatInterface />, below \<Chat />. Responsible for handling the input from users and then submitting messages to the backend. */
const InputBox: React.FC<InputBoxProps> = ({
  handleSubmit
}) => {
  const [chatMessage, setChatMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const inputBoxTextArea = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(e.target.value); //DEBUG View the current value of the input box in console on each keystroke.

    // Update state with the current value of the input box
    setChatMessage(e.target.value);
    if (e.target.value.length > 0 && e.target.value.length < 255) {
      setMessage("");
    }
  };

  /** Call the handleSubmit function passed down from <ChatInterface /> when the user submits a message, and clear the input box and state. */
  const localHandleSubmit = () => {
    if (chatMessage === "") {
      setMessage(
        "Oops! Looks like you forgot to type a message. Please enter your message before sending."
      );
      return;
    }
    // If message box is empty, do nothing
    handleSubmit(chatMessage);

    // Clear the input box and state
    setChatMessage("");
    if (inputBoxTextArea.current) {
      inputBoxTextArea.current.value = "";
    }
  };

  /** Handle the user pressing the Enter key to submit a message. */
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      localHandleSubmit();
    }
  };

  return (
    <div className={style["chat-input-holder"]}>
      {/* Text Box */}
      <textarea
        autoFocus={true}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        className={
          message
            ? style["chat-input-textarea-red-border"]
            : style["chat-input-textarea"]
        }
        placeholder="Send a message"
        ref={inputBoxTextArea}
      />

      {/* Send Button */}
      <div className={style["chat-svg-container"]} onClick={localHandleSubmit}>
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

      {/* Error Modal */}
      {message && (
        <div className={style["message-modal"]}>
          {message}
          <div className={style["arrow"]}></div>
        </div>
      )}
    </div>
  );
};

export default InputBox;

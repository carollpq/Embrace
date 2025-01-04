import style from "../styles/ChatMessage.module.css";
import { Message } from "../app/(root)/chatInterface/layout";

const ChatMessage = ({ role, content }: Message) => {
  const isModel = role === "model";
  return (
    <div className="flex flex-col justify-center pt-3">
      <div
        className={`${isModel ? style["chat-message-chatbot"] : style["chat-message-user"]} ${
          isModel ? "bg-[#e1f4ff]/50" : "bg-black/50"
        } rounded-lg p-2 text-md`}
      >
        {content || "Message is empty"}
      </div>
    </div>
  );
};

export default ChatMessage;

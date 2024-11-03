import style from "../styles/ChatMessage.module.css";
import { Message } from "@/app/(root)/chatInterface/page";

/* Renders each chat message to the screen. */
const ChatMessage = ({ role, content }: Message) => {
    return (
      <>
      {
        role === "assistant" ? 
          (
            <div className="flex flex-col justify-center pt-[12px]">
              <div className={`${style['chat-message-chatbot']} bg-[#e1f4ff]/50 rounded-[15px] text-md font-normal`}>
                <div>  
                  {content}
                </div>
              </div>
            </div>)
          : (
          <div className="flex flex-col justify-center pt-[12px]">
            <div className={`${style['chat-message-user']} text-md bg-black/50 rounded-lg`}>
              <div>  
                {content}
              </div>
            </div>
          </div>) 
        } 
        
      </>
    )
  }

export default ChatMessage;

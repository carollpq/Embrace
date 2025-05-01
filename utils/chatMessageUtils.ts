import { Message } from "ai/react";

export function removeEmojis(text: string): string {
    return text
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ""
      )
      .replace(/[*#/\\~_`|<>{}[\]()]/g, "")
      .trim();
  }
  
  export function isLastAssistantMessage(messages: Message[], currentMessageContent: string): boolean {
    const assistantMessages = messages?.filter(
      (msg) => msg.role === "assistant" && msg.content !== "__typing__"
    );
    return (
      assistantMessages?.length > 0 &&
      assistantMessages[assistantMessages.length - 1].content === currentMessageContent
    );
  }
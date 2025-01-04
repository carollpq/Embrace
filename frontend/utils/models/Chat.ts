import mongoose, { Schema, Document } from "mongoose";

// ChatMessage schema and model
export interface ChatMessage {
  sender: "user" | "model"; // Explicit sender role
  content: string;
  timestamp: Date;
}

// ChatThread schema and model
export interface ChatThread extends Document {
  userId: string; // ID of the user owning the thread
  messages: ChatMessage[]; // Sequential messages in the conversation
  createdAt: Date; // Timestamp for thread creation
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessage>({
  sender: { type: String, required: true, enum: ["user", "model"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatThreadSchema = new Schema<ChatThread>(
  {
    userId: { type: String, required: true },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Prevent overwriting the model if it already exists
const ChatThreadModel = mongoose.models.ChatThread || mongoose.model<ChatThread>("ChatThread", ChatThreadSchema);

export { ChatThreadModel };

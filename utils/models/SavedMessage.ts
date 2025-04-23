import mongoose, { Schema, Document } from "mongoose";

export interface SavedMessage extends Document {
  messageId: string;
  userId: string;
  content: string;
  savedAt: Date;
}

const SavedMessageSchema = new Schema<SavedMessage>({
  messageId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
});

const SavedMessageModel =
  mongoose.models.SavedMessage ||
  mongoose.model<SavedMessage>("SavedMessage", SavedMessageSchema);

export { SavedMessageModel };

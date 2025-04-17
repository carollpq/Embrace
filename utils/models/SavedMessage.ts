import mongoose, { Schema, Document } from "mongoose";

export interface SavedMessage extends Document {
  userId: string;
  content: string;
  savedAt: Date;
  note?: string;
}

const SavedMessageSchema = new Schema<SavedMessage>({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
  note: { type: String },
});

const SavedMessageModel =
  mongoose.models.SavedMessage ||
  mongoose.model<SavedMessage>("SavedMessage", SavedMessageSchema);

export { SavedMessageModel };

// models/message.ts
import { Document, Schema, model } from "mongoose";

export interface IMessageDocument extends Document {
  sender: string; // or Schema.Types.ObjectId
  receiver: string; // or Schema.Types.ObjectId
  text: string;
  isSent: boolean;
  isRead: boolean;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    sender: { type: String, required: true }, // or Schema.Types.ObjectId
    receiver: { type: String, required: true }, // or Schema.Types.ObjectId
    text: { type: String, required: true },
    isSent: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model<IMessageDocument>("Message", MessageSchema);

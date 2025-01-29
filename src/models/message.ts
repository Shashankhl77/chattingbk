/**
 * @swagger
 * components:
 *   schemas:
 *     messages:
 *       type: object
 *       properties:
 *           _id:
 *             type: ObjectId
 *             description: Unique objectId
 *             example: "678b32e829738f74fa77b0b1"
 *           sender:
 *             type: ObjectId
 *             description: Sender ObjectId
 *             example: "678b32e829738f74fa77b0b1"
 *           receiver:
 *             type: ObjectId
 *             description: Receiver ObjectId
 *             example: "678b32e829738f74fa77b0b1"
 *           text:
 *             type: string
 *             description: Text of the message
 *             example: "Hello world"
 *           isSent:
 *             type: boolean
 *             description: Checking the message sent or not
 *             example: true
 *           isRead:
 *             type: boolean
 *             description: Checking the message sent or not
 *             example: true
 */

import { Schema, model, Types, Document } from "mongoose";

interface IMessageDocument extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text: string;
  isSent?: boolean;
  isRead?: boolean;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true },
    isSent: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IMessageDocument>("Message", MessageSchema);

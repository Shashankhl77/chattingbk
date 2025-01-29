/**
 * @swagger
 * components:
 *   schemas:
 *     request:
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
 *           status:
 *             type: string
 *             description: Status of the request
 *             enum:
 *               - REQUEST_SENT
 *               - ACCEPTED
 *               - REJECTED
 */

import { Schema, model, Types, Document } from "mongoose";

export enum STATUS {
  REQUEST_SENT = "REQUEST_SENT",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IRequestDocument extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: STATUS;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequestDocument>(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, enum: Object.values(STATUS), required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default model<IRequestDocument>("requests", RequestSchema);

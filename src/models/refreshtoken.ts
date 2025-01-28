import { ObjectId, Document, Schema, model, Types } from "mongoose";

export interface IRefreshToken {
  token: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

const RefreshtokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Types.ObjectId },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default model<IRefreshTokenDocument>(
  "refreshtokens",
  RefreshtokenSchema
);

import { ObjectId, Document, Schema, model, Types } from "mongoose";

export interface IAccessToken {
  token: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccessTokenDocument extends IAccessToken, Document {}

const AccesstokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Types.ObjectId },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default model<IAccessTokenDocument>("accesstokens", AccesstokenSchema);

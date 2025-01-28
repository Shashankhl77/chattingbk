import { ObjectId, Schema, Document, Types, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  contacts: ObjectId;
  requests: ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    contacts: { type: Types.ObjectId },
    requests: { type: Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default model<IUserDocument>("users", userSchema);

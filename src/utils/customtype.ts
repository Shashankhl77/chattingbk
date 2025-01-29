import { ObjectId, Schema } from "mongoose";
import * as users from "../models/user";

export interface IUser extends users.IUser {
  _id?: Schema.Types.ObjectId | unknown | string;
}

export interface mongoResp {
  id?: string;
  _id?: Schema.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
  otp?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  isVerified?: boolean;
  isUsed?: boolean;
  userId?: Schema.Types.ObjectId | ObjectId;
  type?: string;
  role?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: Unique ObjectId
 *           example: "678b32e829738f74fa77b0b1"
 *         username:
 *           type: string
 *           description: User name
 *           example: Shashank
 *         password:
 *           type: string
 *           description: Password of the user
 *           example: "Admin@123"
 *         contacts:
 *           type: ObjectId
 *           description: Contact of the ObjectId
 *           example: "678b32e829738f74fa77b0b1"
 *         requests:
 *           type: ObjectId
 *           description: request ObjectId
 *           example: "678b32e829738f74fa77b0b1"
 *         isDeleted:
 *           type: boolean
 *           description: Checking the user is deleted or not
 *           example: false
 *         createdAt:
 *           type: date
 *           description: Date of the user created
 *           example: 2025-01-21T09:57:33.585+00:00
 *         updatedAt:
 *           type: date
 *           description: Date of the user updated
 *           example: 2025-01-21T09:57:33.585+00:00
 */

import { Schema, Document, Types, model } from "mongoose";
import { ObjectId } from "bson";
export interface IUser {
  username?: string;
  password?: string;
  contacts?: Types.ObjectId;
  requests?: Types.ObjectId;
  isEnabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    contacts: { type: Types.ObjectId },
    requests: { type: Types.ObjectId },
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const UserModel = model<IUserDocument>("users", userSchema);

export const findById = function (
  id: ObjectId,
  cb: (error: Error | null, result: null | IUser) => void
) {
  UserModel.findById(id)
    .then((result) => {
      cb(null, result);
    })
    .catch(function (error) {
      cb(error, null);
    });
};

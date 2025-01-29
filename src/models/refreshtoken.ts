/**
 * @swagger
 * components:
 *    schemas:
 *      refreshtoken:
 *         type: object
 *         properties:
 *            _id:
 *              type: ObjectId
 *              description: Unique ObjectId
 *              example: "678b32e829738f74fa77b0b1"
 *            userId:
 *              type: ObjectId
 *              description: User uniqueId
 *              example: "678b32e829738f74fa77b0b1"
 *            token:
 *              type: string
 *              description: refreshtoken
 *              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *            createdAt:
 *              type: date
 *              description: Date of the token created
 *              example: 2025-01-21T04:20:32.471+00:00
 *
 *
 */

import { Document, Schema, model, Types } from "mongoose";

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

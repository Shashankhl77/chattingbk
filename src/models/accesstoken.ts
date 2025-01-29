/**
 * @swagger
 * components:
 *    schemas:
 *      accesstokens:
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
 *              description: Accesstoken
 *              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *            createdAt:
 *              type: date
 *              description: Date of the token created
 *
 *
 */

import { Document, Schema, model, Types } from "mongoose";

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
export const accesstoken = model<IAccessTokenDocument>(
  "accesstokens",
  AccesstokenSchema
);

export const findByToken = function (token: string, cb: Function): void {
  accesstoken
    .findOne({ token })
    .then((result) => {
      cb(null, result);
    })
    .catch(function (error) {
      cb(error, null);
    });
};

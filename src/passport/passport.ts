import BearerStrategy from "passport-http-bearer";
import passport from "passport";
import * as Token from "../models/accesstoken";
import { ResponseObj } from "../models/models";
import * as Users from "../models/user";
import { IUser } from "../utils/customtype";
import { mongoResp } from "../utils/customtype";
import { ObjectId } from "bson";
import { Schema } from "mongoose";

export interface tokenInterface {
  token?: string;
  userId?: null | string;
}
passport.use(
  new BearerStrategy.Strategy(function (token, done) {
    Token.findByToken(
      token,
      function (err: Error | null, tokenFromDb: mongoResp) {
        if (err) {
          const responseObj: ResponseObj = new ResponseObj(
            401,
            "Unauthorized",
            "Unauthorized"
          );
          return done(err, false, responseObj.toJsonString());
        }
        if (!tokenFromDb) {
          const responseObj: ResponseObj = new ResponseObj(
            401,
            "Unauthorized",
            "Unauthorized"
          );
          return done(null, false, responseObj.toJsonString());
        }
        if (!tokenFromDb.userId) {
          const responseObj: ResponseObj = new ResponseObj(
            401,
            "Unauthorized",
            "Unauthorized"
          );
          return done(null, false, responseObj.toJsonString());
        }
        const uid = new ObjectId(tokenFromDb.userId.toString());
        Users.findById(uid, function (err: Error | null, user: IUser | null) {
          if (err) {
            const responseObj: ResponseObj = new ResponseObj(
              401,
              "Unauthorized!",
              "Unauthorized"
            );
            return done(err, false, responseObj.toJsonString());
          } else if (!user) {
            const responseObj: ResponseObj = new ResponseObj(
              401,
              "Unauthorized!",
              "Unauthorized"
            );
            return done(null, false, responseObj.toJsonString());
          } else if (user.isDeleted === false && user.isEnabled === true) {
            return done(null, user, { scope: "all" });
          } else {
            const responseObj: ResponseObj = new ResponseObj(
              401,
              "Unauthorized!",
              "Unauthorized"
            );
            return done(null, false, responseObj.toJsonString());
          }
        });
      }
    );
  })
);

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import * as Socket from "./socket/socket";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import "./models/message";
import "./models/user";
import "./models/accesstoken";
import "./models/refreshtoken";
import auth from "./router/auth";
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const MONGO_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/test";
app.use(express.json());
app.use(passport.initialize());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: unknown) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.use("/v1/auth", auth);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

Socket.initSocket(io);
server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}.`);
});
process.on("SIGINT", function () {
  process.exit(0);
});

process.on("SIGTERM", function () {
  process.exit(0);
});

import { ExtendedError, Server, Socket } from "socket.io";
import { UserModel } from "../models/user";
import Message from "../models/message";
import dotenv from "dotenv";
import { accesstoken } from "../models/accesstoken";
import mongoose from "mongoose";
dotenv.config();

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

async function validateToken(token: string): Promise<boolean> {
  try {
    const tokenRecord = await accesstoken.findOne({ token: token });
    if (tokenRecord) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

export const initSocket = (io: Server) => {
  io.use(
    async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
      const token = String(socket.handshake.auth.token);
      const token1 = String(socket.handshake.headers.authorization);

      if (!token || !token1) {
        return next(
          new Error("Unauthorized: Missing JWT token") as ExtendedError
        );
      }
      try {
        const isValidToken = await validateToken(token);
        const isValidToken1 = await validateToken(token1);

        if (!isValidToken && !isValidToken1) {
          throw new Error("Unauthorized. Invalid token.");
        }

        next();
      } catch (error) {
        console.log(error);
        next(
          new Error("Unauthorized. Error validating token.") as ExtendedError
        );
      }
    }
  );

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("addUser", async (data: any) => {
      const userId = data.userId; // Access the userId property from the object
      console.log("Received userId:", userId);
      console.log("Type of userId before conversion:", typeof userId);

      // Explicitly convert to ObjectId if it's valid, otherwise return null
      const stringifiedUserId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId).toString() // Convert to string
        : null;

      // Log the converted userId (now a string)
      console.log("Converted userId:", stringifiedUserId);

      // If the userId is invalid, return an error and stop execution
      if (!stringifiedUserId) {
        console.error("Invalid userId format:", userId);
        return socket.emit("error", { message: "Invalid userId format" });
      }

      // Ensure the userId is correctly compared as a string
      const isUserExist = onlineUsers.find(
        (user) => user.userId === stringifiedUserId
      );

      // If the user doesn't already exist, add them to the onlineUsers array
      if (!isUserExist) {
        onlineUsers.push({ userId: stringifiedUserId, socketId: socket.id });
      }

      // Emit updated online users list
      io.emit("getOnlineUsers", onlineUsers);
      console.log("Updated Online Users:", onlineUsers);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        console.log("Fetching sender and receiver from DB...");

        // Log the receiverId
        console.log("Receiver ID:", receiverId);

        // Validate sender and receiver ID formats
        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          return io
            .to(socket.id)
            .emit("error", { message: "Invalid sender or receiver ID format" });
        }

        // Fetch sender and receiver from DB
        const [sender, receiverUser] = await Promise.all([
          UserModel.findById(new mongoose.Types.ObjectId(senderId)),
          UserModel.findById(new mongoose.Types.ObjectId(receiverId)),
        ]);

        if (!sender || !receiverUser) {
          return io
            .to(socket.id)
            .emit("error", { message: "Sender or receiver not found" });
        }

        console.log("Users found successfully");

        // Ensure the receiver is present in the online users list
        const receiver = onlineUsers.find(
          (user) => String(user.userId) === String(receiverId)
        );
        console.log("Receiver found:", receiver);

        // If receiver is not online
        if (!receiver) {
          console.log("Receiver is not online");
          return io.to(socket.id).emit("error", {
            message: "Receiver is not online",
          });
        }

        // Save the message
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          text,
          isSent: true,
          isRead: false,
        });

        await newMessage.save();

        // Emit message to the receiver if online
        if (receiver?.socketId) {
          io.to(receiver.socketId).emit("getMessage", {
            senderId,
            text,
            isSent: true,
            isRead: false,
          });
        }

        // Emit message sent confirmation
        io.to(socket.id).emit("messageSent", {
          receiverId,
          text,
          isSent: true,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        io.to(socket.id).emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("markAsRead", async ({ messageId, senderId, receiverId }) => {
      try {
        const message = await Message.findById(messageId).exec();
        if (message && message.receiver.toString() === receiverId) {
          message.isRead = true;
          await message.save();

          const sender = onlineUsers.find((user) => user.userId === senderId);
          if (sender) {
            io.to(sender.socketId).emit("messageRead", {
              messageId,
              receiverId,
            });
          }
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
        io.to(socket.id).emit("error", {
          message: "Failed to mark message as read",
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("A user disconnected:", socket.id);
    });
  });
};

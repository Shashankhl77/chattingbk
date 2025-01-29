import { Server, Socket } from "socket.io";
import { IUser, UserModel } from "../models/user";
import Message from "../models/message";

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Add user to online users list
    socket.on("addUser", async (userId: string) => {
      const isUserExist = onlineUsers.find((user) => user.userId === userId);
      if (!isUserExist) {
        onlineUsers.push({ userId, socketId: socket.id });
      }
      io.emit("getOnlineUsers", onlineUsers);
      console.log("Online Users:", onlineUsers);
    });
    // Send and receive messages
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        const receiver = onlineUsers.find((user) => user.userId === receiverId);
        const sender = await UserModel.findById(senderId);
        const receiverUser = await UserModel.findById(receiverId);
        if (!sender || !receiverUser) {
          throw new Error("Sender or receiver not found");
        }
        // Save message to the database
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          text,
          isSent: true,
          isRead: false,
        });
        await newMessage.save();

        // Emit the message to the receiver
        if (receiver) {
          io.to(receiver.socketId).emit("getMessage", {
            senderId,
            text,
            isSent: true,
            isRead: false,
          });
        }

        // Update sender's chat list
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

    // Mark message as read
    socket.on("markAsRead", async ({ messageId, senderId, receiverId }) => {
      try {
        const message = await Message.findById(messageId).exec();
        if (message && message.receiver.toString() === receiverId) {
          message.isRead = true;
          await message.save();

          // Notify the sender that the message has been read
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

    // Handle user disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("A user disconnected:", socket.id);
    });
  });
};

// src/websocket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import Message from "../models/messageModel";
import Match from "../models/matchModel";

export const initializeWebSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Adjust this based on your allowed origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      try {
        // Save the message to the database
        const newMessage = new Message({
          senderId,
          receiverId,
          message,
        });
        await newMessage.save();

        // Find the match and update the chat array
        let match = await Match.findOne({
          $or: [
            { user1ClerkId: senderId, user2ClerkId: receiverId },
            { user1ClerkId: receiverId, user2ClerkId: senderId },
          ],
        });

        if (match) {
          match.chat?.push((newMessage as any)._id);
          await match.save();
        } else {
          // If no match exists, you might want to create one (if that's part of your logic)
          match = new Match({
            user1ClerkId: senderId,
            user2ClerkId: receiverId,
            chat: [newMessage._id],
          });
          await match.save();
        }

        // Broadcast the message to the sender and receiver
        io.to(senderId).emit("receiveMessage", newMessage);
        io.to(receiverId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error handling sendMessage event:", error);
        socket.emit("error", "Error sending message");
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // You can add more event listeners here
  });

  return io;
};

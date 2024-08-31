// src/services/socketService.ts
import { io } from "socket.io-client";

let socket;

try {
  socket = io("http://192.168.1.177:3000", {
    transports: ["websocket"],
    upgrade: false,
  });

  socket.on("connect", () => {
    console.log("WebSocket connected with ID:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err.message, err.code, err);
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected.");
  });

  // Additional event listeners or logic can go here
} catch (error) {
  console.error("Error during WebSocket setup:", error);
}

export default socket;

// src/services/socketService.ts
import io from "socket.io-client";

const SOCKET_URL = process.env.API_URL; // Replace with your actual backend URL

const socket = io(SOCKET_URL!);

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;

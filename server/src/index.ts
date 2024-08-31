import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import {
  ClerkExpressRequireAuth,
  LooseAuthProp,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import { CustomError } from "./middlewares/customError";
import http from "http";

import feedRoutes from "./routes/feedRoutes";
import { initializeWebSocket } from "./services/websocketService";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();
const app: Application = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const ipAddress = "192.168.1.177";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(express.json());

connectDB();

const io = initializeWebSocket(server);

app.use("/api/user", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

app.listen(3000, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});

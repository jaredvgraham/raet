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

import feedRoutes from "./routes/feedRoutes";

import chatRoutes from "./routes/chatRoutes";
import matchRoutes from "./routes/matchRoutes";

dotenv.config();
const app: Application = express();

const port = process.env.PORT || 3001;
const ipAddress = process.env.IP_ADDRESS || "localhost";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/match", matchRoutes);

app.use(errorHandler);

app.listen(3000, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});

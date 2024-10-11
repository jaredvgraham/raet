import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";

import feedRoutes from "./routes/feedRoutes";

import chatRoutes from "./routes/chatRoutes";
import matchRoutes from "./routes/matchRoutes";
import blockRoutes from "./routes/blockRoutes";

import reportRoutes from "./routes/reportRoutes";

dotenv.config();
const app: Application = express();

const port = process.env.PORT || 3000;

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
app.use("/api/block", blockRoutes);
app.use("/api/report", reportRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

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

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3001;

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/feed", feedRoutes);

app.get(
  "/api/chat",
  ClerkExpressRequireAuth(),
  (req: RequireAuthProp<Request>, res: Response) => {
    console.log("backend hit", req.auth);
    console.log("user id is", req.auth.userId);

    res.json(req.headers.authorization);
  }
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

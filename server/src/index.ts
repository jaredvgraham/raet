import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

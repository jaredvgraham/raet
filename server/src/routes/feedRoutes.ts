import { Router } from "express";
import { getFeed, handleLike } from "../controllers/feedController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.get("/", ClerkExpressRequireAuth(), getFeed);

router.post("/like", ClerkExpressRequireAuth(), handleLike);

export default router;

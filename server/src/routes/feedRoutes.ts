import { Router } from "express";
import { getFeed, handleSwipe } from "../controllers/feedController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.get("/", ClerkExpressRequireAuth(), getFeed);

router.post("/swipe", ClerkExpressRequireAuth(), handleSwipe);

export default router;

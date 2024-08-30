import { Router } from "express";
import { getFeed } from "../controllers/feedController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.get("/", ClerkExpressRequireAuth(), getFeed);

export default router;

import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { getLastMsgAndMatch, getMatches } from "../controllers/chatController";

const router = Router();

router.get("/matches", ClerkExpressRequireAuth(), getMatches);

router.get("/conversations", ClerkExpressRequireAuth(), getLastMsgAndMatch);

export default router;

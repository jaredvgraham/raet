import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getChat,
  getLastMsgAndMatch,
  getMatches,
  markMessageAsRead,
  sendMessage,
} from "../controllers/chatController";
import { getMatch } from "../controllers/matchController";

const router = Router();

router.get("/matches", ClerkExpressRequireAuth(), getMatches);

router.get("/conversations", ClerkExpressRequireAuth(), getLastMsgAndMatch);

router.get("/:matchId", ClerkExpressRequireAuth(), getChat);

router.post("/send-message", ClerkExpressRequireAuth(), sendMessage);

router.patch(
  "/message/read/:messageId",
  ClerkExpressRequireAuth(),
  markMessageAsRead
);

export default router;

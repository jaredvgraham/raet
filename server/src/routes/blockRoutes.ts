import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import {
  blockUser,
  getBlockedUsers,
  unblockUser,
} from "../controllers/blockController";

const router = Router();

router.post("/", ClerkExpressRequireAuth(), blockUser);

router.get("/", ClerkExpressRequireAuth(), getBlockedUsers);

router.post("/unblock", ClerkExpressRequireAuth(), unblockUser);

export default router;

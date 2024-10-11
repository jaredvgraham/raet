import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import { blockUser, unblockUser } from "../controllers/blockController";

const router = Router();

router.post("/", ClerkExpressRequireAuth, blockUser);

router.post("/unblock", ClerkExpressRequireAuth, unblockUser);

export default router;

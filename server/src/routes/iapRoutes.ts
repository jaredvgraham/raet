import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import { Router } from "express";
import {
  handleAppStoreNotification,
  verifyPurchase,
} from "../controllers/iapController";

const router = Router();

router.post("/verify", ClerkExpressRequireAuth(), verifyPurchase);

router.post("/notification", handleAppStoreNotification);

export default router;

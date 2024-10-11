import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { getReports, reportUser } from "../controllers/reportController";

const router = Router();

router.get("/", ClerkExpressRequireAuth(), getReports);

router.post("/", ClerkExpressRequireAuth(), reportUser);

export default router;

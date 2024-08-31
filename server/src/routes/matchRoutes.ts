//matchRoutes.ts
import { Router } from "express";
import { getMatch } from "../controllers/matchController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.get("/:matchId", ClerkExpressRequireAuth(), getMatch);

export default router;

// src/routes/userRoutes.ts
import { Router } from "express";
import {
  createProfile,
  getProfile,
  registerUser,
} from "../controllers/userController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

// POST /api/users/register - Register a new user
router.post("/sign-up", registerUser);

router.get("/profile", ClerkExpressRequireAuth(), getProfile);
router.patch("/profile", ClerkExpressRequireAuth(), createProfile);

export default router;

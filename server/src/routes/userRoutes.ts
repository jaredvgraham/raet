// src/routes/userRoutes.ts
import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router();

// POST /api/users/register - Register a new user
router.post("/sign-up", registerUser);

export default router;

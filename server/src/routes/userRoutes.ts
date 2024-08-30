// src/routes/userRoutes.ts
import { Router } from "express";
import {
  createProfile,
  getProfile,
  registerUser,
  updateLocation,
  uploadImages,
} from "../controllers/userController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

// POST /api/users/register - Register a new user
router.post("/sign-up", registerUser);

router.get("/profile", ClerkExpressRequireAuth(), getProfile);
router.patch("/profile", ClerkExpressRequireAuth(), createProfile);

router.patch("/location", ClerkExpressRequireAuth(), updateLocation);

router.patch(
  "/upload-images",
  ClerkExpressRequireAuth(),
  upload.array("images", 10),
  uploadImages
);

export default router;

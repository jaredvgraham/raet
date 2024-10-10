// src/routes/userRoutes.ts
import { Router } from "express";
import {
  createProfile,
  deleteAccount,
  getProfile,
  getUserLikes,
  registerUser,
  updateLocation,
  updateProfile,
  uploadImages,
} from "../controllers/userController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post("/sign-up", registerUser);

router.delete("/", ClerkExpressRequireAuth(), deleteAccount);

router.get("/profile", ClerkExpressRequireAuth(), getProfile);
router.patch("/profile", ClerkExpressRequireAuth(), createProfile);

router.patch("/location", ClerkExpressRequireAuth(), updateLocation);

router.patch(
  "/upload-images",
  ClerkExpressRequireAuth(),
  upload.array("images", 10),
  uploadImages
);

router.patch(
  "/profile/update",
  ClerkExpressRequireAuth(),
  upload.array("images", 10),
  updateProfile
);

router.get("/likes", ClerkExpressRequireAuth(), getUserLikes);

export default router;

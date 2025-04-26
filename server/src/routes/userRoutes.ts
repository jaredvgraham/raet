// src/routes/userRoutes.ts
import { Router } from "express";
import {
  addPushToken,
  createProfile,
  deleteAccount,
  getProfile,
  getProfileById,
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
router.get("/profile/:userId", ClerkExpressRequireAuth(), getProfileById);
router.patch(
  "/profile",
  ClerkExpressRequireAuth(),
  upload.array("images", 10),
  createProfile
);

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

router.post("/push-token", ClerkExpressRequireAuth(), addPushToken);

export default router;

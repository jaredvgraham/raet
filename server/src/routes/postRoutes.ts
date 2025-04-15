//postRoutes.ts
import { Router } from "express";

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
import { createPost, getPostsFeed } from "../controllers/postController";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  ClerkExpressRequireAuth(),
  upload.array("images", 10),
  createPost
);

router.get("/feed", ClerkExpressRequireAuth(), getPostsFeed);

export default router;

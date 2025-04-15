//postRoutes.ts
import { Router } from "express";

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  getPostComments,
  getPostsFeed,
  likePost,
  unlikePost,
} from "../controllers/postController";
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
router.get("/:postId/comments", ClerkExpressRequireAuth(), getPostComments);

router.post("/:postId/like", ClerkExpressRequireAuth(), likePost);
router.post("/:postId/comment", ClerkExpressRequireAuth(), commentOnPost);

router.delete("/:postId", ClerkExpressRequireAuth(), deletePost);
router.delete("/:postId/like", ClerkExpressRequireAuth(), unlikePost);
router.delete("/:postId/comment", ClerkExpressRequireAuth(), deleteComment);

export default router;

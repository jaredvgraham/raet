//postController.ts
import { Request, Response, NextFunction } from "express";

import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { uploadImagesBucket } from "../services/uploadImageService";
import Post from "../models/postModel";
import { getNearbyPosts } from "../services/postService";
import User from "../models/userModel";

export const createPost = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { caption } = req.body;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("req.body", req.body);

    if (!caption && !req.files) {
      return res
        .status(400)
        .json({ message: "Content or images are required" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload images" });
    }

    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await uploadImagesBucket(files);
      console.log("imageUrls", imageUrls);
    }
    console.log("[0]", imageUrls[0]);

    const post = await Post.create({
      userId,
      caption,
      imageUrl: imageUrls[0],
      location: user.location,
    });
    console.log("post", post);

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

export const getPostsFeed = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const before = req.query.before as string | undefined;
    console.log("before", before);
    const posts = await getNearbyPosts(userId, before);
    console.log("posts", posts);

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

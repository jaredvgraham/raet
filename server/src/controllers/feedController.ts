// src/controllers/feedController.ts
import { Request, Response, NextFunction } from "express";
import { getUserFeed, likeUser } from "../services/feedService";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";

export const getFeed = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const feed = await getUserFeed(userId);
    res.status(200).json({ feed });
  } catch (error) {
    next(error);
  }
};

export const handleLike = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { likedId } = req.body;
    const msg = await likeUser(userId, likedId);
    res.status(200).json({ message: msg?.message || "Liked" });
  } catch (error) {
    next(error);
  }
};

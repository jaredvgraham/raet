// src/controllers/feedController.ts
import { Request, Response, NextFunction } from "express";
import {
  getUserFeed,
  likeUser,
  rateUser,
  viewUser,
} from "../services/feedService";
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

export const handleSwipe = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  console.log("endpoint hit");

  try {
    const { userId } = req.auth;
    const { swipedId, direction, rate } = req.body;
    console.log("req.body", req.body);

    if (!swipedId || !direction) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rate) {
      await rateUser(swipedId, rate);
    }

    if (direction === "right") {
      const msg = await likeUser(userId, swipedId);
      res.status(200).json({ message: msg?.message || "Liked" });
    } else if (direction === "left") {
      await viewUser(userId, swipedId);
      res.status(200).json({ message: "Disliked" });
    }
  } catch (error) {
    next(error);
  }
};

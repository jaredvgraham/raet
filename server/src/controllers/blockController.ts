import { Request, Response, NextFunction } from "express";

import Block from "../models/blockModel";
import User from "../models/userModel";

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("attempting to block user");
    console.log("req", req.body);

    const { userId } = req.auth;
    const { blockedUserId } = req.body;

    if (!userId || !blockedUserId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const block = await Block.create({ userId, blockedUserId });

    res.status(201).json({ message: "User blocked successfully", block });
  } catch (error) {
    console.log("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { blockedUserId } = req.body;

    if (!userId || !blockedUserId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await Block.findOneAndDelete({ userId, blockedUserId });

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.log("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlockedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const blocks = await Block.find({ userId });

    const blockedUserIds = blocks.map((block) => block.blockedUserId);

    const blockedUsers = await User.find({ clerkId: { $in: blockedUserIds } });

    res.status(200).json({ blockedUsers });
  } catch (error) {
    console.log("Error fetching blocked users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

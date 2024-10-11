import { Request, Response, NextFunction } from "express";

import Block from "../models/blockModel";

export const blockUser = async (
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

    const block = await Block.create({ userId, blockedUserId });

    res.status(201).json({ message: "User blocked successfully", block });
  } catch (error) {
    next(error);
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
    next(error);
  }
};

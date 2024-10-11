import { Request, Response } from "express";
import Report from "../models/reportModel";
import User from "../models/userModel";

export const reportUser = async (req: Request, res: Response) => {
  const { userId } = req.auth;
  const { reportedUserId, reason } = req.body;

  if (!userId || !reportedUserId || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(reportedUserId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const report = await Report.create({ userId, reportedUserId, reason });

  res.status(201).json({ message: "User reported successfully", report });
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

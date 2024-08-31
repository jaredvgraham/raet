//chat controller
import { Request, Response, NextFunction } from "express";
import Match from "../models/matchModel";
import User from "../models/userModel";

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { matchId } = req.params;
  try {
    const match = await Match.findById(matchId).populate("chat");
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    return res.status(200).json({ chat: match.chat });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("entered getMatches");

  const { userId } = req.auth; // Assume userId is available in req.auth
  try {
    // Find matches related to the user
    const matches = await Match.find({
      $or: [{ user1ClerkId: userId }, { user2ClerkId: userId }],
    });

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "Matches not found" });
    }

    // Fetch the profiles of the matched users
    const matchedUserIds = matches.map((match) => {
      return match.user1ClerkId === userId
        ? match.user2ClerkId
        : match.user1ClerkId;
    });

    const matchedProfiles = await User.find({
      clerkId: { $in: matchedUserIds },
    }).select("name age bio images clerkId");

    return res.status(200).json({ matchedProfiles });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLastMsgAndMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.auth;

  try {
    const matches = await Match.find({
      $or: [{ user1ClerkId: userId }, { user2ClerkId: userId }],
    }).populate({ path: "chat", select: "message sentAt" }); // Populate the chat with only the last message

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "Matches not found" });
    }

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const matchedUserId =
          match.user1ClerkId === userId
            ? match.user2ClerkId
            : match.user1ClerkId;

        const matchedUser = await User.findOne({
          clerkId: matchedUserId,
        }).select("name age bio images");

        const lastMessage =
          match.chat && match.chat.length > 0
            ? match.chat[match.chat.length - 1]
            : null;

        return {
          matchedUser,
          lastMessage,
        };
      })
    );

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

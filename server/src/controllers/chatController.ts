//chat controller
import { Request, Response, NextFunction } from "express";
import Match from "../models/matchModel";
import User, { IUser } from "../models/userModel";
import { db } from "../config/firebase";
import Message from "../models/messageModel";

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
    if (!match.chat) {
      return res.status(400).json({ message: "Chat not found" });
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

    // Prepare an array to store matched profiles with matchId
    const matchedProfilesWithMatchId = [] as any[];

    // Map through the matches to find the user IDs and pair them with their matchId
    const matchedUserIds = matches.map((match) => {
      const matchedUserId =
        match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;
      matchedProfilesWithMatchId.push({
        matchId: match._id,
        clerkId: matchedUserId,
      });
      return matchedUserId;
    });

    // Fetch the profiles of the matched users
    const matchedProfiles = await User.find({
      clerkId: { $in: matchedUserIds },
    }).select("name age bio images clerkId");

    // Combine profiles with their matchIds
    const response = matchedProfiles.map((profile) => {
      const match = (matchedProfilesWithMatchId as any).find(
        (item: { clerkId: string }) => item.clerkId === profile.clerkId
      );
      return {
        matchId: match.matchId,
        profile: {
          name: profile.name,

          bio: (profile as any).bio,
          images: profile.images,
          clerkId: profile.clerkId,
        },
      };
    });

    return res.status(200).json({ matches: response });
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

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { matchId, messageText } = req.body;
  const { userId } = req.auth;

  console.log("at sendMessage", req.body);

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Create and save the message in MongoDB
    const message = new Message({
      senderId: userId,
      receiverId:
        match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId,
      message: messageText,
    });
    await message.save();

    // Push message to Firebase for real-time updates
    const chatRef = db.ref(`chats/${matchId}`);
    await chatRef.push({
      id: (message as any)._id,
      senderId: userId,
      message: messageText,
      sentAt: Date.now(),
    });

    // Update Match with the new message

    if (!match.chat) {
      match.chat = [];
    }

    match.chat.push((message as any)._id);
    await match.save();

    return res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

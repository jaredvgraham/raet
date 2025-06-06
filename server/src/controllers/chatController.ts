//chat controller
import { Request, Response, NextFunction } from "express";
import Match from "../models/matchModel";
import User, { IUser } from "../models/userModel";
import { db } from "../config/firebase";
import Message from "../models/messageModel";
import { v4 as uuidv4 } from "uuid";
import Chat from "../models/chatModel";
import Block from "../models/blockModel";
import { sendPushNotification } from "../utils/push";

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { matchId } = req.params;
  const { userId } = req.auth; // Assuming userId is available in req.auth

  try {
    // Fetch the match data to find the other user's Clerk ID
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const matchedUserId =
      match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;

    // Check if the current user or the matched user has blocked each other
    const blockExists = await Block.findOne({
      $or: [
        { userId: userId, blockedUserId: matchedUserId }, // Current user blocked the matched user
        { userId: matchedUserId, blockedUserId: userId }, // Matched user blocked the current user
      ],
    });

    if (blockExists) {
      return res.status(403).json({ message: "Access to chat is blocked." });
    }

    const chat = await Chat.findOne({ matchId }).populate("messages");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json({ chat: chat.messages });
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

    const blockList = await Block.find({
      $or: [{ userId: userId }, { blockedUserId: userId }],
    });

    const blockedIds = blockList.map((block) =>
      block.userId === userId ? block.blockedUserId : block.userId
    );

    const matches = await Match.find({
      $or: [{ user1ClerkId: userId }, { user2ClerkId: userId }],
      $and: [
        { user1ClerkId: { $nin: blockedIds } },
        { user2ClerkId: { $nin: blockedIds } },
      ],
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
  console.log("getLastMsgAndMatch");

  try {
    const blockList = await Block.find({
      $or: [{ userId: userId }, { blockedUserId: userId }],
    });

    const blockedIds = blockList.map((block) =>
      block.userId === userId ? block.blockedUserId : block.userId
    );

    const matches = await Match.find({
      $or: [{ user1ClerkId: userId }, { user2ClerkId: userId }],
      $and: [
        { user1ClerkId: { $nin: blockedIds } },
        { user2ClerkId: { $nin: blockedIds } },
      ],
    }).populate("chat"); // Populate the chat field to get the chat IDs

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "Matches not found" });
    }

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const chat = await Chat.findOne({ matchId: match._id }).populate({
          path: "messages",
          options: { sort: { sentAt: -1 }, limit: 1 },
        });

        const matchedUserId =
          match.user1ClerkId === userId
            ? match.user2ClerkId
            : match.user1ClerkId;

        const matchedUser = await User.findOne({
          clerkId: matchedUserId,
        }).select("name age bio images");

        const lastMessage =
          chat && chat.messages.length > 0 ? chat.messages[0] : null;

        if (lastMessage) {
          return {
            matchedUser,
            matchId: match._id,
            lastMessage,
          };
        }

        return null; // Return null if there's no last message
      })
    );

    // Filter out null values (i.e., matches without messages)
    console.log("conversations before filtering ", conversations);

    const filteredConversations = conversations.filter(
      (conversation) => conversation !== null
    );

    console.log("conversations after filtering ", filteredConversations);

    if (filteredConversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    filteredConversations.sort((a, b) => {
      return (
        new Date((b?.lastMessage as any).sentAt).getTime() -
        new Date((a?.lastMessage as any).sentAt).getTime()
      );
    });

    return res.status(200).json({ conversations: filteredConversations });
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

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchedUserId =
      match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;

    const blockExists = await Block.findOne({
      $or: [
        { userId: userId, blockedUserId: matchedUserId },
        { userId: matchedUserId, blockedUserId: userId },
      ],
    });

    if (blockExists) {
      return res.status(403).json({ message: "Access to chat is blocked." });
    }

    let chat = await Chat.findOne({ matchId: matchId });
    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({
        matchId: matchId,
        messages: [],
      });
      await chat.save();

      // Update the Match to reference the new Chat
      (match as any).chat = chat._id;
      await match.save();
    }

    // Create and save the message in MongoDB
    const message = new Message({
      id: uuidv4(),
      senderId: userId,
      receiverId:
        match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId,
      message: messageText,
      receiverViewed: false,
    });
    await message.save();

    // Push message to Firebase for real-time updates
    const chatRef = db.ref(`chats/${matchId}`);

    const msg = {
      id: (message as any).id,
      senderId: userId,
      receiverId: (message as any).receiverId,
      message: messageText,
      sentAt: Date.now(),
      receiverViewed: false,
    };

    await chatRef.child((message as any).id).set(msg);

    // Update Chat with the new message
    chat.messages.push((message as any)._id);
    await chat.save();

    const matchedUser = await User.findOne({ clerkId: matchedUserId });

    if (matchedUser?.pushToken) {
      console.log("Sending push to:", matchedUser.pushToken);
      console.log("Payload:", {
        to: matchedUser.pushToken,
        title: "New message",
        body: messageText.slice(0, 80),
        data: {
          type: "new-message",
          matchId,
          senderId: userId,
        },
      });

      await sendPushNotification({
        to: matchedUser.pushToken,
        title: "New message",
        body: `${user.name} sent you a message`,
        data: {
          type: "new-message",
          matchId,
          senderId: userId,
        },
      });
    } else {
      console.warn("No push token for matched user:", matchedUserId);
    }

    return res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// chatController.js

export const markMessageAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { messageId } = req.params;
  const { userId } = req.auth;
  const { matchId } = req.body; // Assuming matchId is passed in the request body

  try {
    // Fetch the message from Firebase
    const messageRef = db.ref(`chats/${matchId}/${messageId}`);
    const messageSnapshot = await messageRef.once("value");
    const messageData = messageSnapshot.val();

    if (!messageData) {
      return res.status(404).json({ message: "Message not found in Firebase" });
    }

    // Ensure that only the intended receiver can mark the message as read
    if (messageData.receiverId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the message as read in Firebase
    await messageRef.update({ receiverViewed: true });

    // Also update the message in MongoDB
    const message = await Message.findOne({ id: messageId });

    if (message) {
      message.receiverViewed = true;
      await message.save();
    }

    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

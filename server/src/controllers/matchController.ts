import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import Match from "../models/matchModel";
import { calculateDistance } from "../utils/calculateDistance";
import { calculateAge } from "../utils/calculateAge";
import { getUserPosts } from "../services/postService";

export const getMatch = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { matchId } = req.params;

    console.log("req.params", req.params);

    const user = await User.findOne({ clerkId: userId });
    const match = await Match.findOne({ _id: matchId });

    const matchProfile = await User.findOne({
      clerkId:
        match?.user1ClerkId === userId
          ? match?.user2ClerkId
          : match?.user1ClerkId,
    });

    console.log("user", user);
    console.log("match", matchProfile);

    if (!user || !matchProfile) {
      return res.status(404).json({ message: "User or match not found" });
    }

    const isMatch =
      user.matchedUsers && user.matchedUsers.includes(matchProfile.clerkId);

    if (!isMatch) {
      return res.status(400).json({ message: "Match not found" });
    }
    let distance;
    if (user.location && matchProfile.location) {
      distance = await calculateDistance(
        user?.location?.coordinates,
        matchProfile.location.coordinates
      );
    }

    const recentPosts = await getUserPosts(matchProfile.clerkId, userId);

    const age = calculateAge(matchProfile.dob);

    const matchProfileWithPosts = {
      ...matchProfile.toObject(),
      recentPosts: recentPosts,
    };

    res
      .status(200)
      .json({ matchProfile: matchProfileWithPosts, distance, age });
  } catch (error) {
    next(error);
  }
};

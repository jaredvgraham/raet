import Match from "../../models/matchModel"; // Assuming the model is in models folder
import { CustomError } from "../../middlewares/customError";

export const createMatch = async (
  user1ClerkId: string,
  user2ClerkId: string
) => {
  try {
    console.log("Creating match between:", user1ClerkId, user2ClerkId);

    const existingMatch = await Match.findOne({
      user1ClerkId,
      user2ClerkId,
    });

    if (existingMatch) {
      console.log("Match already exists:", existingMatch);
      return;
    }

    const newMatch = new Match({ user1ClerkId, user2ClerkId });
    await newMatch.save();
    return newMatch;
    console.log("Match created successfully:", newMatch);
  } catch (error) {
    console.error("Error creating match:", error);
    throw new CustomError("Failed to create match", 500);
  }
};

export const getUserMatches = async (clerkId: string) => {
  try {
    const matches = await Match.find({
      $or: [{ user1ClerkId: clerkId }, { user2ClerkId: clerkId }],
    }).exec();
    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

export const getMatchesProfile = async (userIdclerkId: string) => {};

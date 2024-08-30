import Match from "../../models/matchModel"; // Assuming the model is in models folder

export const createMatch = async (user1Id: string, user2Id: string) => {
  try {
    const newMatch = new Match({ user1: user1Id, user2: user2Id });
    await newMatch.save();
    console.log("Match created successfully:", newMatch);
  } catch (error) {
    console.error("Error creating match:", error);
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

import { IUser } from "../models/userModel";

export function generateMatchScores(currentUser: IUser, users: IUser[]) {
  const userInterests = new Set(currentUser.interests || []);
  const userAvgRating =
    currentUser.ratings && currentUser.ratings.length > 0
      ? currentUser.ratings.reduce((acc, r) => acc + r, 0) /
        currentUser.ratings.length
      : 0;

  return users.map((otherUser) => {
    const otherInterests = new Set(otherUser.interests || []);
    const sharedInterests = new Set(
      [...userInterests].filter((i) => otherInterests.has(i))
    );

    const totalUniqueInterests = new Set([...userInterests, ...otherInterests]);

    const interestScore =
      totalUniqueInterests.size === sharedInterests.size
        ? 40
        : (sharedInterests.size / totalUniqueInterests.size) * 40;

    const lookingForScore =
      currentUser.lookingFor === otherUser.lookingFor ? 15 : 0;

    const otherAvgRating = (otherUser as any).averageRating || 0;

    const ratingDiff =
      userAvgRating === 0 || otherAvgRating === 0
        ? 0
        : Math.abs(otherAvgRating - userAvgRating);

    const ratingScore = ratingDiff >= 2 ? 0 : 45 - ratingDiff * 22.5;

    const matchScore = Math.round(
      interestScore + lookingForScore + ratingScore
    );

    return { ...otherUser, matchScore };
  });
}

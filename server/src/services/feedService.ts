import mongoose from "mongoose";
import { IUser } from "../models/userModel";
import { CustomError } from "../middlewares/customError";
import User from "../models/userModel";
import { createMatch } from "./matches";

export const getUserFeed = async (userId: string): Promise<IUser[]> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const [lon, lat] = user.location?.coordinates || [0, 0];

  if (!lon || !lat) {
    throw new CustomError("User location not available", 400);
  }

  const maxDistanceMeters = (user.maxDistance || 10000) * 1609.34; // Convert miles to meters
  const currentYear = new Date().getFullYear();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const nearbyUsers = await User.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lon, lat],
        },
        distanceField: "distance", // This will add a 'distance' field to the results
        spherical: true,
        maxDistance: maxDistanceMeters,
      },
    },
    {
      $addFields: {
        age: {
          $subtract: [currentYear, { $year: "$dob" }],
        },
      },
    },
    {
      $match: {
        $and: [
          { clerkId: { $ne: user.clerkId } }, // Exclude the current user
          { clerkId: { $nin: user.likedUsers || [] } }, // Exclude users already liked
          { clerkId: { $nin: user.matchedUsers || [] } }, // Exclude users already matched
          {
            viewedUsers: {
              $not: {
                $elemMatch: {
                  clerkId: user.clerkId,
                  viewedAt: { $gte: twoMonthsAgo },
                },
              },
            },
          }, // Exclude users viewed in the last two months
          { gender: user.preferredGender }, // Match gender preference
          {
            age: {
              $gte: user.preferredAgeRange?.[0] || 18,
              $lte: user.preferredAgeRange?.[1] || 100,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        age: 1,
        bio: 1,
        interests: 1,
        images: 1,
        clerkId: 1,
        distance: { $round: [{ $divide: ["$distance", 1609.34] }, 2] }, // Convert distance to miles and round to 2 decimal places
      },
    },
  ]);

  return nearbyUsers;
};

export const likeUser = async (userId: string, likedUserId: string) => {
  const user = await User.findOne({ clerkId: userId });
  const likedUser = await User.findOne({ clerkId: likedUserId });

  if (!user || !likedUser) {
    throw new CustomError("User not found", 404);
  }

  if (user.likedUsers && user.likedUsers.includes(likedUserId)) {
    throw new CustomError("User already liked", 400);
  }

  user.likedUsers?.push(likedUserId);
  await user.save();

  if (likedUser.likedUsers && likedUser.likedUsers.includes(userId)) {
    console.log("Match found!");
    user.matchedUsers?.push(likedUserId);
    likedUser.matchedUsers?.push(userId);
    await user.save();
    await likedUser.save();

    await createMatch(user.clerkId, likedUser.clerkId);

    return { message: `Match found for ${likedUser.name}` };
  }
};

export const viewUser = async (userId: string, viewedUserId: string) => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const now = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(now.getMonth() + 2);

  user.viewedUsers = user.viewedUsers || [];

  // Check if the user was already viewed, if so, update the viewedAt time
  const existingView = user.viewedUsers.find(
    (view) => view.userId.toString() === viewedUserId
  );

  if (existingView) {
    existingView.viewedAt = now;
  } else {
    user.viewedUsers.push({ userId: viewedUserId, viewedAt: now });
  }

  await user.save();

  return { message: "User viewed" };
};

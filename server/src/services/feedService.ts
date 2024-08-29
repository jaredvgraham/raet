import mongoose, { FilterQuery } from "mongoose";
import { IUser } from "../models/userModel";
import { CustomError } from "../middlewares/customError";
import User from "../models/userModel";

export const getUserFeed = async (userId: string): Promise<IUser[]> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const [lon, lat] = user.location?.coordinates || [0, 0];

  if (!lon || !lat) {
    throw new CustomError("User location not available", 400);
  }

  const maxDistanceMiles = user.maxDistance || 10000;
  const distanceInRadians = (maxDistanceMiles * 1609.34) / 6378100;

  const currentYear = new Date().getFullYear();

  const nearbyUsers = await User.aggregate([
    {
      $addFields: {
        age: {
          $subtract: [currentYear, { $year: "$dob" }],
        },
      },
    },
    {
      $match: {
        _id: { $ne: user._id },
        location: {
          $geoWithin: {
            $centerSphere: [[lon, lat], distanceInRadians],
          },
        },
        gender: user.preferredGender, // Optional: match gender preference
        age: {
          $gte: user.preferredAgeRange?.[0] || 18,
          $lte: user.preferredAgeRange?.[1] || 100,
        },
      },
    },
  ]);

  return nearbyUsers;
};

// src/services/userService.ts
import { CustomError } from "../middlewares/customError";
import User, { IUser } from "../models/userModel";

export const createUser = async (
  name: string,
  email: string,
  clerkId: string
): Promise<IUser> => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new CustomError("User already exists", 400); // 400 Bad Request
  }

  const user = new User({
    name,
    email,
    clerkId,
  });

  await user.save();

  return user;
};

export const createUserProfile = async (
  userId: string,
  dateOfBirth: Date,
  gender: "Male" | "Female",
  interests: string[],
  preferredGender: "Male" | "Female" | "Both"
): Promise<IUser> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.dob = new Date(dateOfBirth);
  user.gender = gender;
  user.interests = interests;
  user.preferredGender = preferredGender;

  await user.save();

  return user;
};

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404); // 404 Not Found
  }
  return user;
};

export const updateUserLocation = async (
  userId: string,
  lon: number,
  lat: number
) => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.location = {
    type: "Point",
    coordinates: [lon, lat],
  };

  await user.save();

  return user;
};

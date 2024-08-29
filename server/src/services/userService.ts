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

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new CustomError("User not found", 404); // 404 Not Found
  }
  return user;
};

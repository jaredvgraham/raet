// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import {
  createUser,
  createUserProfile,
  getUserProfile,
} from "../services/userService";
import clerkClient from "../config/clerk";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { calculateAge } from "../utils/calculateAge";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, clerkId } = req.body;
    console.log("req.body", req.body);

    if (!name || !email || !clerkId) {
      return res.status(400).json({ message: "All fields are required" }); // 400 Bad Request
    }

    const user = await createUser(name, email, clerkId);
    console.log("user", user);

    const mongoStringId = (user as any)._id.toString();

    await clerkClient.users.updateUser(clerkId, {
      externalId: mongoStringId,
    });

    await clerkClient.users
      .getUser(clerkId)

      .catch((error) => {
        console.log("error", error);
      });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};

export const createProfile = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { dateOfBirth, gender, interests } = req.body;

    console.log("req.body", req.body);

    if (!dateOfBirth || !gender || !interests) {
      return res.status(400).json({ message: "All fields are required" }); // 400 Bad Request
    }

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      return res.status(400).json({ message: "You must be 18 or older" }); // 400 Bad Request
    }

    const profile = await createUserProfile(
      userId,
      dateOfBirth,
      gender,
      interests
    );
    console.log("profile", profile);

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProfile = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    console.log("userId", userId);
    const profile = await getUserProfile(userId);
    const hasProfile = profile.gender ? true : false;

    const age = calculateAge(profile.dob);

    const updatedProfile = {
      ...profile.toJSON(),
      age,
    };

    res.status(200).json({ updatedProfile, hasProfile });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};

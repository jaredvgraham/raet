// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import {
  createUser,
  createUserProfile,
  getUserProfile,
  updateUserLocation,
} from "../services/userService";
import clerkClient from "../config/clerk";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { calculateAge } from "../utils/calculateAge";
import User from "../models/userModel";
import { uploadImagesBucket } from "../services/uploadImageService";
import Like from "../models/likeModel";

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
    next(error);
  }
};

export const createProfile = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { dateOfBirth, gender, interests, preferredGender } = req.body;

    console.log("req.body", req.body);

    if (!dateOfBirth || !gender || !interests || !preferredGender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      return res.status(400).json({ message: "You must be 18 or older" });
    }

    const profile = await createUserProfile(
      userId,
      dateOfBirth,
      gender,
      interests,
      preferredGender
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

export const updateLocation = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  console.log("entered updateLocation");

  try {
    const { userId } = req.auth;
    const { lon, lat } = req.body;
    console.log("lon", lon);
    console.log("lat", lat);

    if (lon === undefined || lat === undefined) {
      return res
        .status(400)
        .json({ message: "Longitude and latitude are required" });
    }

    await updateUserLocation(userId, lon, lat);

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("req.files", req.files);
    console.log("req.body", req.body);

    if (!req.files) {
      return res.status(400).json({ message: "Please upload images" });
    }

    console.log("req.files", req.files);

    const imageUrls = await uploadImagesBucket(
      req.files as Express.Multer.File[]
    );
    console.log("imageUrls", imageUrls);

    user.images = imageUrls;
    await user.save();

    res.status(200).json({ message: "Images uploaded successfully", user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, bio, preferredGender, maxDistance, interests } = req.body;
    const images = req.files as Express.Multer.File[];

    const imageUrls = await uploadImagesBucket(images);

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.preferredGender = preferredGender || user.preferredGender;
    user.maxDistance = maxDistance
      ? parseInt(maxDistance, 10)
      : user.maxDistance;
    user.interests = interests
      ? interests.split(",").map((item: string) => item.trim())
      : user.interests;
    user.images = imageUrls.length > 0 ? imageUrls : user.images;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        bio: user.bio,
        preferredGender: user.preferredGender,
        maxDistance: user.maxDistance,
        interests: user.interests,
        images: user.images,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserLikes = async (
  req: RequireAuthProp<Request>,
  res: Response
) => {
  try {
    console.log("entered getUserLikes");

    const { userId } = req.auth; // The logged-in user's clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find likes where the current user was liked (i.e., `likedUserId` is the current user's clerkId)
    const likes = await Like.find({ likedUserId: user.clerkId });

    // Extract the profiles of users who liked the current user
    const likedUsersProfiles = await Promise.all(
      likes.map(async (like) => {
        try {
          const likedUser = await User.findOne({ clerkId: like.userId });
          if (likedUser) {
            return {
              _id: likedUser._id,
              name: likedUser.name,
              clerkId: likedUser.clerkId,
              email: likedUser.email,
              age: calculateAge(likedUser.dob),
              images: likedUser.images,
            };
          }
          return null; // In case the likedUser is not found
        } catch (err) {
          console.error("Error fetching user:", err);
          return null; // Return null if there's an error fetching the user
        }
      })
    );

    // Filter out any null values from the results
    const validProfiles = likedUsersProfiles.filter(Boolean);

    console.log("validProfiles", validProfiles);

    res.status(200).json({ likes: validProfiles });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

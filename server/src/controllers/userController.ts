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
import { calculateDistance } from "../utils/calculateDistance";
import Block from "../models/blockModel";
import { getUserPosts } from "../services/postService";

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

export const getProfileById = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { userId: id } = req.params;
    console.log("userId", userId);
    console.log("id", id);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const isUser = id === userId;

    const profile = await User.findOne({ clerkId: id });
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    const age = calculateAge(profile.dob);

    const [lon, lat] = user.location?.coordinates || [0, 0];

    const profilePosts = await getUserPosts(id, userId);

    let distance = null;

    if (!isUser) {
      distance =
        lon && lat && profile.location
          ? await calculateDistance(profile.location.coordinates, [lon, lat])
          : null;
    }
    const ProfileAverageRating =
      profile.ratings && profile.ratings.length > 0
        ? profile.ratings.reduce((acc, curr) => acc + curr, 0) /
          profile.ratings.length
        : 0;
    const updatedProfile = {
      ...profile.toJSON(),
      age,
      distance,
      averageRating: ProfileAverageRating,
      posts: profilePosts,
    };
    console.log("updatedProfile", updatedProfile);
    res.status(200).json({ updatedProfile });
  } catch (error) {
    console.log("error", error);
    next(error);
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

    const {
      name,
      bio,
      jobTitle,
      relationshipType,
      lookingFor,
      drinkingHabits,
      smokingHabits,
      preferredGender,
      maxDistance,
      interests,
      pets,
      preferredAgeRange,
      instagram,
    } = req.body;

    const images = req.files as Express.Multer.File[];
    const imageUrls = await uploadImagesBucket(images);

    // Basic fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.jobTitle = jobTitle || user.jobTitle;
    user.relationshipType = relationshipType || user.relationshipType;
    user.lookingFor = lookingFor || user.lookingFor;
    user.drinkingHabits = drinkingHabits || user.drinkingHabits;
    user.smokingHabits = smokingHabits || user.smokingHabits;
    user.preferredGender = preferredGender || user.preferredGender;

    // Max distance
    if (maxDistance) {
      user.maxDistance = parseInt(maxDistance, 10);
    }

    // Array fields
    if (interests) {
      user.interests = interests
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length);
    }

    if (pets) {
      user.pets = pets
        .split(",")
        .map((pet: string) => pet.trim())
        .filter((pet: string) => pet.length);
    }

    if (preferredAgeRange) {
      const [min, max] = preferredAgeRange
        .split(",")
        .map((num: string) => parseInt(num.trim(), 10));
      if (!isNaN(min) && !isNaN(max)) {
        user.preferredAgeRange = [min, max];
      }
    }

    // Social media
    if (instagram) {
      user.socialMedia = {
        ...user.socialMedia,
        instagram,
      };
    }

    // Images
    if (imageUrls.length > 0) {
      user.images = imageUrls;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
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

    const blockList = await Block.find({
      $or: [{ userId: user.clerkId }, { blockedUserId: user.clerkId }],
    });

    const blockedUserIds = blockList.map((block) =>
      block.userId === user.clerkId ? block.blockedUserId : block.userId
    );

    const likes = await Like.find({
      likedUserId: user.clerkId,
      userId: { $nin: blockedUserIds },
    });

    const likedUsersProfiles = await Promise.all(
      likes.map(async (like) => {
        try {
          const likedUser = await User.findOne({ clerkId: like.userId });
          if (likedUser && !likedUser.matchedUsers?.includes(user.clerkId)) {
            const userAverageRating =
              likedUser.ratings && likedUser.ratings.length > 0
                ? likedUser.ratings.reduce((acc, curr) => acc + curr, 0) /
                  likedUser.ratings.length
                : 0;

            const maxDistanceMeters =
              (likedUser.maxDistance || 10000) * 1609.34;

            const [lon, lat] = likedUser.location?.coordinates || [0, 0];

            return {
              _id: likedUser._id,
              name: likedUser.name,
              clerkId: likedUser.clerkId,
              email: likedUser.email,
              age: calculateAge(likedUser.dob),
              bio: likedUser.bio,
              interests: likedUser.interests,
              images: likedUser.images,
              distance:
                lon && lat && user.location
                  ? await calculateDistance(user.location.coordinates, [
                      lon,
                      lat,
                    ])
                  : null,
              averageRating: userAverageRating,
              maxDistance: maxDistanceMeters / 1609.34, // Convert meters to miles
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

export const deleteAccount = async (
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

    clerkClient.users.deleteUser(userId);

    await user.deleteOne();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addPushToken = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ message: "Push token is required" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pushToken = pushToken;
    await user.save();

    res.status(200).json({ message: "Push token added successfully" });
  } catch (error) {
    next(error);
  }
};

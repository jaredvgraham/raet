// src/controllers/feedController.ts
import { Request, Response, NextFunction } from "express";
import {
  getUserFeed,
  likeUser,
  rateUser,
  viewUser,
} from "../services/feedService";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import Post from "../models/postModel";
import PostLike from "../models/postLikeModel";
import Comment from "../models/commentModel";

export const getFeed = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const feed = await getUserFeed(userId);

    console.log("feed", feed);

    const usersWithRecentPosts = await Promise.all(
      feed.map(async (user) => {
        const recentPostsRaw = await Post.find({ userId: user.clerkId })
          .sort({ createdAt: -1 })
          .limit(2);

        const recentPosts = await Promise.all(
          recentPostsRaw.map(async (post) => {
            // Fetch like & comment count
            const [likeCount, commentCount, liked] = await Promise.all([
              PostLike.countDocuments({ postId: post._id }),
              Comment.countDocuments({ postId: post._id }),
              PostLike.exists({ postId: post._id, userId }),
            ]);

            return {
              _id: post._id,
              caption: post.caption,
              imageUrl: post.imageUrl,
              createdAt: post.createdAt,
              userId: user.clerkId,
              userName: user.name,
              userAvatar: user.images?.[0] || null,
              likeCount,
              commentCount,
              likedByCurrentUser: !!liked, // optional: set this if needed
            };
          })
        );

        return {
          ...user,
          recentPosts,
        };
      })
    );

    res.status(200).json({ feed: usersWithRecentPosts });
  } catch (error) {
    next(error);
  }
};

export const handleSwipe = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  console.log("endpoint hit");

  try {
    const { userId } = req.auth;
    const { swipedId, direction, rate } = req.body;
    console.log("req.body", req.body);

    if (!swipedId || !direction) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rate) {
      await rateUser(swipedId, rate);
    }

    if (direction === "right") {
      const msg = await likeUser(userId, swipedId);
      res.status(200).json({ message: msg?.message || "Liked" });
    } else if (direction === "left") {
      await viewUser(userId, swipedId);
      res.status(200).json({ message: "Disliked" });
    }
  } catch (error) {
    next(error);
  }
};

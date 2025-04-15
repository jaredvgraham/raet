//postController.ts
import { Request, Response, NextFunction } from "express";

import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { uploadImagesBucket } from "../services/uploadImageService";
import Post from "../models/postModel";
import { getNearbyPosts } from "../services/postService";
import User from "../models/userModel";
import PostLike from "../models/postLikeModel";
import Comment from "../models/commentModel";

export const createPost = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { caption } = req.body;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("req.body", req.body);

    if (!caption && !req.files) {
      return res
        .status(400)
        .json({ message: "Content or images are required" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload images" });
    }

    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await uploadImagesBucket(files);
      console.log("imageUrls", imageUrls);
    }
    console.log("[0]", imageUrls[0]);

    const post = await Post.create({
      userId,
      caption,
      imageUrl: imageUrls[0],
      location: user.location,
    });
    console.log("post", post);

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

export const getPostsFeed = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const before = req.query.before as string | undefined;
    console.log("before", before);

    const rawPosts = await getNearbyPosts(userId, before);

    const postMap = new Map<string, any>();

    for (const post of rawPosts) {
      const id = post._id.toString();
      const existing = postMap.get(id);

      if (!existing) {
        postMap.set(id, post);
      } else if (!existing.userAvatar && post.userAvatar) {
        postMap.set(id, post); // Prefer version with avatar
      }
    }

    const posts = Array.from(postMap.values());

    posts.forEach((p) =>
      console.log(
        p.caption,
        p.userName,
        p.userAvatar,
        p.commentCount || "NO comments",
        p.likeCount || "NO likes"
      )
    );

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.auth;

    const existing = await PostLike.findOne({ postId, userId });
    if (existing) return res.status(400).json({ message: "Already liked" });

    const like = await PostLike.create({ postId, userId });
    res.status(201).json({ message: "Post liked", like });
  } catch (err) {
    next(err);
  }
};

export const unlikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.auth;

    await PostLike.deleteOne({ postId, userId });
    res.status(200).json({ message: "Post unliked" });
  } catch (err) {
    next(err);
  }
};

export const commentOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.auth;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text required" });
    }

    const commentDoc = await Comment.create({ postId, userId, text });

    const user = await User.findOne({ clerkId: userId }).lean();

    const comment = {
      _id: commentDoc._id,
      postId: commentDoc.postId,
      userId: commentDoc.userId,
      text: commentDoc.text,
      createdAt: commentDoc.createdAt,
      userName: user?.name || "Unknown",
      userAvatar: user?.images?.[0] || null,
    };

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    next(err);
  }
};

export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich each comment with userName and userAvatar
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ clerkId: comment.userId }).lean();
        return {
          _id: comment._id,
          postId: comment.postId,
          userId: comment.userId,
          text: comment.text,
          createdAt: comment.createdAt,
          userName: user?.name || "Unknown",
          userAvatar: user?.images?.[0] || null,
        };
      })
    );

    res.status(200).json({ comments: enrichedComments });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.auth;

    const post = await Post.findOne({ _id: postId, userId });
    if (!post)
      return res
        .status(403)
        .json({ message: "Unauthorized or post not found" });

    await Post.deleteOne({ _id: postId });
    await PostLike.deleteMany({ postId });
    await Comment.deleteMany({ postId });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.auth;
    const { commentId } = req.body;

    const comment = await Comment.findOne({ _id: commentId, postId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Allow deletion if the user is the comment author OR the post owner
    if (comment.userId !== userId && post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

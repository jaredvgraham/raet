import Post from "../models/postModel";
import User from "../models/userModel";

export const getNearbyPosts = async (userId: string, beforeDate?: string) => {
  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser?.location) throw new Error("Location missing");

  const [lon, lat] = currentUser.location.coordinates;
  const maxDistanceMeters = (currentUser.maxDistance || 10000) * 1609.34;
  const preferredGender = currentUser.preferredGender;
  const before = beforeDate ? new Date(beforeDate) : new Date();

  const posts = await Post.aggregate([
    // Join user info
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "clerkId",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },

    // Join likes
    {
      $lookup: {
        from: "postlikes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },

    // Join comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },

    // Filter: time, gender, location
    {
      $match: {
        createdAt: { $lt: before },
        $or: [
          ...(beforeDate
            ? []
            : [
                {
                  "userDetails.clerkId": currentUser.clerkId,
                },
              ]), // Include user's own posts
          {
            $and: [
              {
                "userDetails.gender":
                  preferredGender === "Both"
                    ? { $in: ["Male", "Female"] }
                    : preferredGender,
              },
              {
                "userDetails.location": {
                  $geoWithin: {
                    $centerSphere: [[lon, lat], maxDistanceMeters / 6378137], // radius in radians
                  },
                },
              },
            ],
          },
        ],
      },
    },

    // Count likes & comments
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        likedByCurrentUser: {
          $in: [
            userId,
            { $map: { input: "$likes", as: "like", in: "$$like.userId" } },
          ],
        },
      },
    },

    // Output cleaned data
    {
      $project: {
        _id: 1,
        caption: 1,
        imageUrl: 1,
        createdAt: 1,
        likeCount: 1,
        commentCount: 1,
        likedByCurrentUser: 1,
        userId: "$userDetails.clerkId",
        userName: "$userDetails.name",
        userAvatar: { $arrayElemAt: ["$userDetails.images", 0] },
      },
    },

    // Sort and limit
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
  ]);

  return posts;
};

export const getUserPosts = async (
  userId: string,
  viewerId?: string // who's viewing the posts (for likedByCurrentUser)
) => {
  const rawPosts = await Post.aggregate([
    { $match: { userId } },

    // Join user info
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "clerkId",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },

    // Join likes
    {
      $lookup: {
        from: "postlikes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },

    // Join comments
    {
      $lookup: {
        from: "postcomments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },

    // Add computed fields
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        likedByCurrentUser: viewerId
          ? {
              $in: [
                viewerId,
                {
                  $map: {
                    input: "$likes",
                    as: "like",
                    in: "$$like.userId",
                  },
                },
              ],
            }
          : false,
      },
    },

    // Final shape
    {
      $project: {
        _id: 1,
        caption: 1,
        imageUrl: 1,
        createdAt: 1,
        likeCount: 1,
        commentCount: 1,
        likedByCurrentUser: 1,
        userId: "$userDetails.clerkId",
        userName: "$userDetails.name",
        userAvatar: { $arrayElemAt: ["$userDetails.images", 0] },
      },
    },

    // Sort newest first
    { $sort: { createdAt: -1 } },
  ]);

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

  return posts;
};

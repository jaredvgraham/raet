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
        from: "postcomments",
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
          ...(beforeDate ? [] : [{ userId: currentUser.clerkId }]), // Include user's own posts
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

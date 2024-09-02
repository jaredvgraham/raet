import mongoose, { Document, Schema } from "mongoose";

// Interface for the Like document
export interface ILike extends Document {
  userId: string; // The user who liked someone
  likedUserId: string; // The user who was liked
  createdAt: Date;
}

// Define the Like schema
const likeSchema = new Schema<ILike>({
  userId: { type: String, required: true, ref: "User" }, // Ensure ref is set to 'User'
  likedUserId: { type: String, required: true, ref: "User" }, // Ensure ref is set to 'User'
  createdAt: { type: Date, default: Date.now, required: true },
});

// Index to ensure a user can't like the same person multiple times
likeSchema.index({ userId: 1, likedUserId: 1 }, { unique: true });

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;

// src/models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  dob: Date;
  gender?: string;
  rate?: number | null;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  maxDistance?: number;
  interests?: string[];
  preferredAgeRange?: [number, number];
  preferredGender?: string;
  likedUsers?: mongoose.Types.ObjectId[];
  viewedUsers?: {
    userId: mongoose.Types.ObjectId;
    viewedAt: Date;
  }[];
  matchedUsers?: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: false },
  gender: { type: String, required: false },
  rate: { type: Number, required: false, default: null },
  location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: false },
  },
  maxDistance: { type: Number, required: false, default: 10000 },
  interests: [{ type: String, required: false }],
  preferredAgeRange: { type: [Number], required: false, default: [18, 100] },
  preferredGender: { type: String, required: false },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  viewedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;

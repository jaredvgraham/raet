// src/models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  dob: Date;
  gender?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  maxDistance?: number;
  interests?: string[];
  preferredAgeRange?: [number, number];
  preferredGender?: string;
  likedUsers?: mongoose.Types.ObjectId[];
  viewedUsers: {
    userId: mongoose.Types.ObjectId;
    viewedAt: Date;
  }[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: false },
  gender: { type: String, required: false },
  location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: false },
  },
  maxDistance: { type: Number, required: false },
  interests: [{ type: String, required: false }],
  preferredAgeRange: { type: [Number], required: false },
  preferredGender: { type: String, required: false },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  viewedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      viewedAt: { type: Date, required: true },
    },
  ],
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;

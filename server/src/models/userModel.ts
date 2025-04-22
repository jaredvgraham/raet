// src/models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  dob: Date;
  bio?: string;
  gender?: "Male" | "Female";
  ratings?: number[] | null;
  images?: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  maxDistance?: number;
  interests?: string[];
  preferredAgeRange?: [number, number];
  preferredGender?: "Male" | "Female" | "Both";
  likedUsers?: string[];
  viewedUsers?: {
    userId: string;
    viewedAt: Date;
  }[];
  matchedUsers?: string[];
  lookingFor?: "Short-term" | "Long-term" | "IDK";
  isVerified?: boolean;
  relationshipType?:
    | "Monogamous"
    | "Polyamorous"
    | "Open"
    | "Swinger"
    | "Other";
  jobTitle?: string;
  pets?: string[];
  drinkingHabits?: string;
  smokingHabits?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  pushToken?: string;
  subscription?: {
    productId:
      | "none"
      | "basic_monthly"
      | "standard_monthly"
      | "premium_monthly";
    expiresAt?: Date;
    platform?: string;
    originalTransactionId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: false },
  bio: { type: String, required: false },
  gender: { type: String, enum: ["Male", "Female"], required: false },
  ratings: { type: [Number], required: false },
  images: [{ type: String, required: false }],
  location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: false },
  },
  maxDistance: { type: Number, required: false, default: 10000 },
  interests: [{ type: String, required: false }],
  preferredAgeRange: { type: [Number], required: false, default: [18, 100] },
  preferredGender: {
    type: String,
    enum: ["Male", "Female", "Both"],
    required: false,
  },
  likedUsers: [{ type: String, ref: "User" }],
  viewedUsers: [
    {
      userId: { type: String, ref: "User" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  matchedUsers: [{ type: String, ref: "User" }],
  lookingFor: {
    type: String,
    enum: ["Short-term", "Long-term", "IDK"],
    required: false,
  },
  isVerified: { type: Boolean, default: false },
  relationshipType: {
    type: String,
    enum: ["Monogamous", "Polyamorous", "Open", "Swinger", "Other"],
    required: false,
  },
  jobTitle: { type: String, required: false },
  pets: [{ type: String, required: false }],
  drinkingHabits: { type: String, required: false },
  smokingHabits: { type: String, required: false },
  socialMedia: {
    instagram: { type: String, required: false },
    facebook: { type: String, required: false },
    tiktok: { type: String, required: false },
  },
  pushToken: { type: String, required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subscription: {
    productId: {
      type: String,
      enum: ["none", "basic_monthly", "standard_monthly", "premium_monthly"],
      default: "none",
    },
    expiresAt: { type: Date },
    platform: { type: String },
    originalTransactionId: { type: String },
  },
});

userSchema.index({ location: "2dsphere" });
userSchema.index({ clerkId: 1, email: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;

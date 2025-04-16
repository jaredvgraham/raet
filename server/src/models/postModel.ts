import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  userId: string;
  caption?: string;
  imageUrl: string;
  shares: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: { type: String, required: true },
  caption: { type: String, required: false },
  imageUrl: { type: String, required: true },
  shares: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

postSchema.index({ location: "2dsphere" });

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;

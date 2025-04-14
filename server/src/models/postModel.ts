import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  userId: string;
  caption: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: { type: String, required: true },
  caption: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;

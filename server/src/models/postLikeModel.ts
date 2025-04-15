import mongoose, { Schema, Document } from "mongoose";

export interface IPostLike extends Document {
  userId: string;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<IPostLike>({
  userId: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const PostLike = mongoose.model<IPostLike>("PostLike", likeSchema);

export default PostLike;

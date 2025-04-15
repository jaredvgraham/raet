import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  userId: string;
  postId: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  userId: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;

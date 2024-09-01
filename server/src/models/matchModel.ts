import mongoose, { Document, Schema } from "mongoose";

export interface IMatch extends Document {
  user1ClerkId: string;
  user2ClerkId: string;
  matchedAt: Date;
  chat?: mongoose.Types.ObjectId[];
}

const matchSchema = new Schema<IMatch>({
  user1ClerkId: { type: String, required: true },
  user2ClerkId: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now },

  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

matchSchema.index({ user1ClerkId: 1, user2ClerkId: 1 }, { unique: true });

const Match = mongoose.model<IMatch>("Match", matchSchema);

export default Match;

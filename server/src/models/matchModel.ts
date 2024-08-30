import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModel"; // Assuming you have a User model defined

export interface IMatch extends Document {
  user1ClerkId: string;
  user2ClerkId: string;
  matchedAt: Date;
  messages?: string[]; // Optional: store message IDs if you want to link to a Message model
}

const matchSchema = new Schema<IMatch>({
  user1ClerkId: { type: String, required: true },
  user2ClerkId: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now },

  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Assuming you have a Message model
});

matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Match = mongoose.model<IMatch>("Match", matchSchema);

export default Match;

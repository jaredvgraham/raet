import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  matchId: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
}

const chatSchema = new Schema<IChat>({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;

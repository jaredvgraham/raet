import mongoose, { Schema, model, models } from "mongoose";

export interface IBlock {
  userId: string;
  blockedUserId: string;
}

const blockSchema = new Schema<IBlock>({
  userId: {
    type: String,
    required: true,
  },
  blockedUserId: {
    type: String,
    required: true,
  },
});

const Block = models.Block || model<IBlock>("Block", blockSchema);

export default Block;

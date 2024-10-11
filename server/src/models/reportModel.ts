import mongoose, { Schema, model, models } from "mongoose";

export interface IReport {
  reporterId: string; // Clerk ID of the user who is reporting
  reportedUserId: string; // Clerk ID of the user being reported
  reason: string; // Reason for the report (e.g., inappropriate content, harassment)
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  reporterId: { type: String, required: true },
  reportedUserId: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Report = models.Report || model<IReport>("Report", reportSchema);

export default Report;

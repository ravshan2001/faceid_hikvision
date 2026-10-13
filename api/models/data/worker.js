import { Types, Schema, model } from "mongoose";

const workerHistorySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  company: String,
  staffPosition: String,
  enterDate: Date,
  leaveDate: Date,
  comment: String,
}, { timestamps: true });

// BUG FIX #6: { worker: 1 } emas, schemada bu field "user" deb nomlanadi
workerHistorySchema.index({ user: 1 });

export const WorkerHistoryModel = model("worker_history", workerHistorySchema);

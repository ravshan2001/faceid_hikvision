import { Schema, model } from "mongoose";

const doorSchema = new Schema(
  {
    title: { type: String, required: true },
    ip: { type: String, required: true },
    port: { type: Number, required: true, default: 7443 },
    login: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["enter", "exit"], required: true },
    // ✅ QO'SHING
    useHttps: {
      type: Boolean,
      default: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "branch" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    doorStatus: { type: String, enum: ["online", "offline"], default: "offline" },
    isOpen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

doorSchema.index({ ip: 1, port: 1 });
doorSchema.index({ status: 1 });
doorSchema.index({ doorStatus: 1 });
doorSchema.index({ branch: 1 });

export const DoorModel = model("door", doorSchema);

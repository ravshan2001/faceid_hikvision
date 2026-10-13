import { Schema, model } from "mongoose";

// Script faqat o‘zining synced userlarini saqlasin (API users emas)
const userSchema = new Schema(
  { employeeNo: { type: String, index: true } },
  { timestamps: true, collection: "synced_users" }
);

export const UserModel = model("synced_user", userSchema);

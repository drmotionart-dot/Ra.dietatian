import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    passwordHash: String,
    image: String,
    emailVerified: Date,
    sex: String,
    dateOfBirth: Date,
    heightCm: Number,
    activityLevel: Number,
    goal: String,
    targetWeightKg: Number,
    locale: { type: String, default: "ar" },
    units: { type: String, default: "metric" },
  },
  { timestamps: true, collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

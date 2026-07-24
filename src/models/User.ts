import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: String,
    image: String,
    emailVerified: Date,
    sex: { type: String, enum: ["male", "female", "other"], default: "male" },
    dateOfBirth: Date,
    heightCm: Number,
    activityLevel: Number,
    goal: { type: String, enum: ["maintain", "lose", "gain"], default: "maintain" },
    targetWeightKg: Number,
    locale: { type: String, default: "ar" },
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
  },
  { timestamps: true, collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

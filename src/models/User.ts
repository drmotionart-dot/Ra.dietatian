import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: String,
    image: String,
    emailVerified: Date,
    isOnboarded: { type: Boolean, default: false },
    sex: { type: String, enum: ["male", "female", "other"], default: "male" },
    dateOfBirth: Date,
    heightCm: Number,
    weightKg: Number,
    activityLevel: Number,
    goal: { type: String, enum: ["maintain", "lose", "gain"], default: "maintain" },
    targetWeightKg: Number,
    locale: { type: String, default: "ar" },
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
    waterGoalMl: { type: Number, default: 2500, min: 500, max: 10000 },
    fastingCity: { type: String, default: "Cairo" },
    fastingCountry: { type: String, default: "Egypt" },
    suhoorTime: { type: String, default: "03:30" },
    iftarTime: { type: String, default: "19:00" },
  },
  { timestamps: true, collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

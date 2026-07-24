import mongoose, { Schema } from "mongoose";

const WorkoutSetSchema = new Schema(
  {
    exerciseId: { type: String, required: true },
    exerciseName: { type: String, required: true },
    setNumber: { type: Number, required: true },
    reps: Number,
    weight: Number,
    weightUnit: { type: String, default: "kg" },
    duration: Number,
    rpe: Number,
    notes: String,
    isWarmup: { type: Boolean, default: false },
    isDropset: { type: Boolean, default: false },
  },
  { timestamps: false, collection: "workout_sets" }
);

const WorkoutSessionSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: String,
    date: { type: Date, default: Date.now },
    duration: Number,
    totalVolume: { type: Number, default: 0 },
    totalSets: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    notes: String,
    feeling: { type: String, enum: ["great", "good", "okay", "bad"], default: "good" },
    sets: [WorkoutSetSchema],
  },
  { timestamps: true, collection: "workout_sessions" }
);

WorkoutSessionSchema.index({ userId: 1, date: -1 });
WorkoutSessionSchema.index({ userId: 1 });

export const WorkoutSession = mongoose.models.WorkoutSession || mongoose.model("WorkoutSession", WorkoutSessionSchema);
export const WorkoutSet = mongoose.models.WorkoutSet || mongoose.model("WorkoutSet", WorkoutSetSchema);

import mongoose, { Schema } from "mongoose";

const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    nameAr: String,
    category: { type: String, required: true },
    muscleGroup: { type: String, required: true },
    equipment: { type: String, default: "none" },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    isPreset: { type: Boolean, default: false },
    userId: String,
  },
  { timestamps: true, collection: "exercises" }
);

ExerciseSchema.index({ name: "text" });
ExerciseSchema.index({ category: 1 });
ExerciseSchema.index({ muscleGroup: 1 });
ExerciseSchema.index({ userId: 1 });

export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

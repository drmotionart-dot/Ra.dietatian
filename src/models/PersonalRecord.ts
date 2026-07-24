import mongoose, { Schema } from "mongoose";

const PersonalRecordSchema = new Schema(
  {
    userId: { type: String, required: true },
    exerciseId: { type: String, required: true },
    exerciseName: { type: String, required: true },
    type: { type: String, enum: ["maxWeight", "maxReps", "maxVolume"], required: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true },
    workoutSessionId: { type: String },
  },
  { timestamps: true, collection: "personal_records" }
);

PersonalRecordSchema.index({ userId: 1, exerciseId: 1, type: 1 });
PersonalRecordSchema.index({ userId: 1, date: -1 });

export const PersonalRecord =
  mongoose.models.PersonalRecord || mongoose.model("PersonalRecord", PersonalRecordSchema);

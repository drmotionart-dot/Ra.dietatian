import mongoose, { Schema } from "mongoose";

const BodyMeasurementSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    weightKg: Number,
    bodyFatPercent: Number,
    waistCm: Number,
    hipCm: Number,
    bicepCm: Number,
    chestCm: Number,
    thighCm: Number,
    neckCm: Number,
    bmi: Number,
    waistToHipRatio: Number,
    notes: String,
    photoUrl: String,
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "body_measurements" }
);

BodyMeasurementSchema.index({ userId: 1, date: 1 });

export const BodyMeasurement =
  mongoose.models.BodyMeasurement || mongoose.model("BodyMeasurement", BodyMeasurementSchema);

import mongoose, { Schema } from "mongoose";

const WaterLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amountMl: { type: Number, required: true },
    note: String,
  },
  { timestamps: true, collection: "water_logs" }
);

WaterLogSchema.index({ userId: 1, date: -1 });

export const WaterLog = mongoose.models.WaterLog || mongoose.model("WaterLog", WaterLogSchema);

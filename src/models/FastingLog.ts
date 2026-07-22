import mongoose, { Schema } from "mongoose";

const FastingLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    hijriYear: Number,
    hijriMonth: Number,
    hijriDay: Number,
    fastingType: { type: String, required: true },
    suhoorTime: String,
    iftarTime: String,
    fajrTime: String,
    maghribTime: String,
    completed: { type: Boolean, default: false },
    loggedSuhoor: { type: Boolean, default: false },
    suhoorCalories: Number,
    suhoorFoods: [Schema.Types.Mixed],
    loggedIftar: { type: Boolean, default: false },
    iftarCalories: Number,
    iftarFoods: [Schema.Types.Mixed],
    fastingDurationHours: Number,
    notes: String,
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "fasting_logs" }
);

FastingLogSchema.index({ userId: 1, date: 1 });

export const FastingLog = mongoose.models.FastingLog || mongoose.model("FastingLog", FastingLogSchema);

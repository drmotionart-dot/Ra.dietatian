import mongoose, { Schema } from "mongoose";

const FastingPreferenceSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    ramadanEnabled: { type: Boolean, default: false },
    ramadanAutoDetect: { type: Boolean, default: true },
    ramadanTheme: { type: Boolean, default: false },
    sunnahMondayThursday: { type: Boolean, default: false },
    sunnahAyyamAlBeed: { type: Boolean, default: false },
    sunnahSixDaysShawwal: { type: Boolean, default: false },
    sunnahDayOfArafah: { type: Boolean, default: false },
    sunnahDayOfAshura: { type: Boolean, default: false },
    city: { type: String, default: "Cairo" },
    country: { type: String, default: "Egypt" },
    latitude: Number,
    longitude: Number,
    calcMethod: { type: Number, default: 5 },
    hijriAdjustment: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true }, collection: "fasting_preferences" }
);

export const FastingPreference =
  mongoose.models.FastingPreference || mongoose.model("FastingPreference", FastingPreferenceSchema);

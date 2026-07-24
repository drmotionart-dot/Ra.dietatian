import mongoose, { Schema } from "mongoose";

const PushSubscriptionSchema = new Schema(
  {
    endpoint: { type: String, required: true },
    expirationTime: Number,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
  { _id: false, timestamps: false }
);

const NotificationPreferenceSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    mealRemindersEnabled: { type: Boolean, default: true },
    mealReminderTimes: [{ hour: Number, minute: Number }],
    waterRemindersEnabled: { type: Boolean, default: true },
    waterIntervalMinutes: { type: Number, default: 60 },
    waterStartTime: { hour: Number, minute: Number },
    waterEndTime: { hour: Number, minute: Number },
    exerciseRemindersEnabled: { type: Boolean, default: true },
    exercisePreferredTime: { hour: Number, minute: Number },
    exerciseDaysOfWeek: [Number],
    weightRemindersEnabled: { type: Boolean, default: true },
    weightPreferredTime: { hour: Number, minute: Number },
    weightFrequency: { type: String, default: "weekly" },
    fastingRemindersEnabled: { type: Boolean, default: true },
    suhoorReminderOffset: { type: Number, default: 30 },
    iftarReminderOffset: { type: Number, default: 15 },
    milestoneCelebrations: { type: Boolean, default: true },
    prAlerts: { type: Boolean, default: true },
    measurementRemindersEnabled: { type: Boolean, default: true },
    measurementFrequency: { type: String, default: "monthly" },
    measurementPreferredDay: { type: Number, default: 0 },
    quietHoursStart: { hour: Number, minute: Number },
    quietHoursEnd: { hour: Number, minute: Number },
    pushSubscriptions: [PushSubscriptionSchema],
    pushEnabled: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: false, updatedAt: true }, collection: "notification_preferences" }
);

export const NotificationPreference =
  mongoose.models.NotificationPreference || mongoose.model("NotificationPreference", NotificationPreferenceSchema);

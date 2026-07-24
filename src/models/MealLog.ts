import mongoose, { Schema } from "mongoose";

const MealLogItemSchema = new Schema(
  {
    mealLogId: { type: String, required: true },
    refType: { type: String, required: true },
    refId: { type: String, required: true },
    foodId: String,
    quantity: { type: Number, required: true },
    unit: { type: String, default: "g" },
    servingWeight: Number,
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "meal_log_items" }
);

MealLogItemSchema.index({ mealLogId: 1 });

const MealLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    mealType: { type: String, required: true, enum: ["breakfast", "lunch", "dinner", "snack"] },
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    totalFiber: { type: Number, default: 0 },
    notes: String,
  },
  { timestamps: true, collection: "meal_logs" }
);

MealLogSchema.index({ userId: 1, date: 1 });
MealLogSchema.index({ userId: 1, date: 1, mealType: 1 }, { unique: true });

export const MealLog = mongoose.models.MealLog || mongoose.model("MealLog", MealLogSchema);
export const MealLogItem = mongoose.models.MealLogItem || mongoose.model("MealLogItem", MealLogItemSchema);

import mongoose, { Schema } from "mongoose";

const FoodSchema = new Schema(
  {
    source: { type: String, default: "user" },
    sourceId: String,
    name: { type: String, required: true },
    nameAr: String,
    brand: String,
    category: { type: String, required: true },
    servingSize: { type: Number, default: 100 },
    servingUnit: { type: String, default: "g" },
    servingDescription: String,
    imageUrl: String,
    barcode: String,
    nutrientProfile: {
      type: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
      },
      default: {},
    },
    dataQuality: { type: String, default: "user-entered" },
    region: String,
  },
  { timestamps: true, collection: "foods" }
);

FoodSchema.index({ name: "text" });
FoodSchema.index({ barcode: 1 });
FoodSchema.index({ category: 1 });

export const Food = mongoose.models.Food || mongoose.model("Food", FoodSchema);

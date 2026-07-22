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
    nutrientProfile: Schema.Types.Mixed,
    dataQuality: { type: String, default: "user-entered" },
    region: String,
  },
  { timestamps: true, collection: "foods" }
);

FoodSchema.index({ name: "text" });
FoodSchema.index({ barcode: 1 });
FoodSchema.index({ category: 1 });

export const Food = mongoose.models.Food || mongoose.model("Food", FoodSchema);

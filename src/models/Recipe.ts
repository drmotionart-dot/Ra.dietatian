import mongoose, { Schema } from "mongoose";

const RecipeItemSchema = new Schema(
  {
    recipeId: { type: String, required: true },
    foodId: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "g" },
    isOptional: { type: Boolean, default: false },
  },
  { timestamps: false, collection: "recipe_items" }
);

RecipeItemSchema.index({ recipeId: 1 });

const RecipeSchema = new Schema(
  {
    userId: String,
    name: { type: String, required: true },
    nameAr: String,
    description: String,
    category: String,
    cuisineStyle: String,
    cookingMethod: String,
    instructions: [String],
    instructionsAr: [String],
    tips: [String],
    tipsAr: [String],
    prepTimeMinutes: Number,
    cookTimeMinutes: Number,
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    nutritionPerServing: {
      type: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
      },
      default: {},
    },
    servingsCount: { type: Number, default: 1 },
    occasions: [String],
  },
  { timestamps: true, collection: "recipes" }
);

RecipeSchema.index({ category: 1 });
RecipeSchema.index({ userId: 1 });

export const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
export const RecipeItem = mongoose.models.RecipeItem || mongoose.model("RecipeItem", RecipeItemSchema);

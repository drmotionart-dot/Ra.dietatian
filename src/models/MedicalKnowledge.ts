import mongoose, { Schema } from "mongoose";

const MedicalKnowledgeSchema = new Schema(
  {
    foodId: { type: String, required: true, unique: true },
    foodCategory: { type: String, required: true },
    micronutrients: [Schema.Types.Mixed],
    vitamins: [Schema.Types.Mixed],
    pros: [Schema.Types.Mixed],
    cons: [Schema.Types.Mixed],
    conditions: [Schema.Types.Mixed],
    drugInteractions: [Schema.Types.Mixed],
    disclaimer: String,
    disclaimerAr: String,
    lastReviewed: Date,
    reviewedBy: String,
  },
  { timestamps: true, collection: "medical_knowledge" }
);

export const MedicalKnowledge =
  mongoose.models.MedicalKnowledge || mongoose.model("MedicalKnowledge", MedicalKnowledgeSchema);

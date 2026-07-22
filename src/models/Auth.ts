import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  { timestamps: false, collection: "accounts" }
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const SessionSchema = new Schema(
  {
    sessionToken: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: false, collection: "sessions" }
);

const VerificationTokenSchema = new Schema(
  {
    identifier: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { timestamps: false, collection: "verification_tokens" }
);

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);
export const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
export const VerificationToken =
  mongoose.models.VerificationToken || mongoose.model("VerificationToken", VerificationTokenSchema);

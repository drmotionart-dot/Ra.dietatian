import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";

const VALID_GOALS = ["maintain", "lose", "gain"];
const VALID_SEX = ["male", "female", "other"];
const VALID_ACTIVITY_LEVELS = [1.2, 1.375, 1.55, 1.725, 1.9];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const errors: string[] = [];

    if (!body.sex || !VALID_SEX.includes(body.sex)) {
      errors.push("sex is required and must be male, female, or other");
    }

    const age = body.dateOfBirth ? parseInt(body.dateOfBirth) : undefined;
    if (!age || age < 10 || age > 120) {
      errors.push("age is required and must be between 10 and 120");
    }

    const heightCm = body.heightCm ? parseFloat(body.heightCm) : undefined;
    if (!heightCm || heightCm < 100 || heightCm > 250) {
      errors.push("heightCm is required and must be between 100 and 250");
    }

    const weightKg = body.weightKg ? parseFloat(body.weightKg) : undefined;
    if (!weightKg || weightKg < 20 || weightKg > 400) {
      errors.push("weightKg is required and must be between 20 and 400");
    }

    if (!body.activityLevel || !VALID_ACTIVITY_LEVELS.includes(body.activityLevel)) {
      errors.push("activityLevel is required and must be one of: " + VALID_ACTIVITY_LEVELS.join(", "));
    }

    if (!body.goal || !VALID_GOALS.includes(body.goal)) {
      errors.push("goal is required and must be maintain, lose, or gain");
    }

    let targetWeightKg: number | undefined;
    if (body.goal !== "maintain") {
      targetWeightKg = body.targetWeightKg ? parseFloat(body.targetWeightKg) : undefined;
      if (!targetWeightKg || targetWeightKg < 20 || targetWeightKg > 400) {
        errors.push("targetWeightKg is required when goal is not maintain, and must be between 20 and 400");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    await connectDB();

    const birthYear = new Date().getFullYear() - age!;

    const update: Record<string, unknown> = {
      isOnboarded: true,
      sex: body.sex,
      dateOfBirth: new Date(`${birthYear}-01-01`),
      heightCm: heightCm,
      weightKg: weightKg,
      activityLevel: body.activityLevel,
      goal: body.goal,
      waterGoalMl: Math.round(weightKg! * (body.activityLevel >= 1.725 ? 35 : body.activityLevel >= 1.55 ? 33 : 30)),
    };
    if (targetWeightKg) update.targetWeightKg = targetWeightKg;
    if (Array.isArray(body.dietaryPreferences)) update.dietaryPreferences = body.dietaryPreferences;
    if (Array.isArray(body.interests)) update.interests = body.interests;
    if (body.fastingCity) {
      update.fastingCity = body.fastingCity;
      update.fastingCountry = "Egypt";
    }

    await User.findByIdAndUpdate(session.user.id, update);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

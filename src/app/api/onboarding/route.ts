import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sex, dateOfBirth, heightCm, weightKg, activityLevel, goal, targetWeightKg } = await req.json();

    await connectDB();

    const update: Record<string, unknown> = {
      isOnboarded: true,
    };

    if (sex) update.sex = sex;
    if (dateOfBirth) {
      const age = parseInt(dateOfBirth);
      if (age >= 10 && age <= 120) {
        const birthYear = new Date().getFullYear() - age;
        update.dateOfBirth = new Date(`${birthYear}-01-01`);
      }
    }
    if (heightCm) update.heightCm = parseFloat(heightCm);
    if (weightKg) update.weightKg = parseFloat(weightKg);
    if (activityLevel) update.activityLevel = activityLevel;
    if (goal) update.goal = goal;
    if (targetWeightKg) update.targetWeightKg = parseFloat(targetWeightKg);

    await User.findByIdAndUpdate(session.user.id, update);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

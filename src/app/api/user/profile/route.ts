import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { auth } from "@/lib/auth";

const PROFILE_BOUNDS = {
  heightCm: [100, 250],
  weightKg: [20, 400],
  targetWeightKg: [20, 400],
  waterGoalMl: [500, 10000],
} as const;

const VALID_SEX = ["male", "female", "other"];
const VALID_GOALS = ["maintain", "lose", "gain"];
const VALID_UNITS = ["metric", "imperial"];
const VALID_ACTIVITY_LEVELS = [1.2, 1.375, 1.55, 1.725, 1.9];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ _id: session.user.id })
      .select("-passwordHash")
      .lean();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const allowed = ["name", "sex", "dateOfBirth", "heightCm", "activityLevel", "goal", "targetWeightKg", "units", "waterGoalMl", "fastingCity", "fastingCountry", "suhoorTime", "iftarTime"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const errors: string[] = [];
    if (updates.sex && !VALID_SEX.includes(updates.sex as string)) {
      errors.push("sex must be male, female, or other");
    }
    if (updates.goal && !VALID_GOALS.includes(updates.goal as string)) {
      errors.push("goal must be maintain, lose, or gain");
    }
    if (updates.units && !VALID_UNITS.includes(updates.units as string)) {
      errors.push("units must be metric or imperial");
    }
    if (updates.activityLevel && !VALID_ACTIVITY_LEVELS.includes(updates.activityLevel as number)) {
      errors.push("activityLevel must be one of: " + VALID_ACTIVITY_LEVELS.join(", "));
    }
    for (const key of Object.keys(PROFILE_BOUNDS)) {
      const val = updates[key];
      if (val !== undefined && val !== null) {
        const n = parseFloat(val as string);
        if (isNaN(n)) {
          errors.push(`${key} must be a valid number`);
        } else {
          const bounds = PROFILE_BOUNDS[key as keyof typeof PROFILE_BOUNDS];
          if (n < bounds[0] || n > bounds[1]) {
            errors.push(`${key} must be between ${bounds[0]} and ${bounds[1]}`);
          }
        }
      }
    }
    if (updates.dateOfBirth) {
      const dob = new Date(updates.dateOfBirth as string);
      if (isNaN(dob.getTime())) {
        errors.push("dateOfBirth must be a valid date");
      } else {
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 10 || age > 120) {
          errors.push("age must be between 10 and 120");
        }
      }
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { _id: session.user.id },
      { $set: updates },
      { new: true }
    )
      .select("-passwordHash")
      .lean();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

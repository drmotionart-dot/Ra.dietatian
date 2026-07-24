import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NotificationPreference } from "@/models";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let prefs = await NotificationPreference.findOne({ userId: session.user.id }).lean();
    if (!prefs) {
      prefs = await NotificationPreference.create({ userId: session.user.id });
    }

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("Get notifications error:", error);
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

    const allowed = [
      "mealRemindersEnabled", "waterRemindersEnabled", "waterIntervalMinutes",
      "exerciseRemindersEnabled", "weightRemindersEnabled", "weightFrequency",
      "fastingRemindersEnabled", "milestoneCelebrations",
      "measurementRemindersEnabled", "measurementFrequency",
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const prefs = await NotificationPreference.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BodyMeasurement, User } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    const measurements = await BodyMeasurement.find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ measurements });
  } catch (error) {
    console.error("Get measurements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { date, weightKg, bodyFatPercent, waistCm, hipCm, bicepCm, chestCm, thighCm, neckCm, notes } = body;

    const user = await User.findOne({ _id: session.user.id }).select("heightCm").lean();

    let bmi: number | null = null;
    let waistToHipRatio: number | null = null;

    if (weightKg && user?.heightCm) {
      const heightM = user.heightCm / 100;
      bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    }

    if (waistCm && hipCm) {
      waistToHipRatio = parseFloat((waistCm / hipCm).toFixed(2));
    }

    const measurement = await BodyMeasurement.create({
      userId: session.user.id,
      date: date ? new Date(date) : new Date(),
      weightKg,
      bodyFatPercent,
      waistCm,
      hipCm,
      bicepCm,
      chestCm,
      thighCm,
      neckCm,
      bmi,
      waistToHipRatio,
      notes,
    });

    return NextResponse.json({ measurement }, { status: 201 });
  } catch (error) {
    console.error("Create measurement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

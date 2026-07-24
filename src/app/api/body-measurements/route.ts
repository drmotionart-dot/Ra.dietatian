import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BodyMeasurement, User } from "@/models";
import { auth } from "@/lib/auth";
import { sanitizeString } from "@/lib/sanitize";

const BOUNDS = {
  weightKg: [20, 400],
  bodyFatPercent: [3, 70],
  waistCm: [30, 200],
  hipCm: [30, 200],
  bicepCm: [10, 100],
  chestCm: [30, 200],
  thighCm: [10, 120],
  neckCm: [15, 80],
} as const;

function validateBounds(key: string, value: number): string | null {
  const bounds = BOUNDS[key as keyof typeof BOUNDS];
  if (bounds && (value < bounds[0] || value > bounds[1])) {
    return `${key} must be between ${bounds[0]} and ${bounds[1]}`;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "30") || 30, 100);

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

    const hasAny = [weightKg, bodyFatPercent, waistCm, hipCm, bicepCm, chestCm, thighCm, neckCm].some(
      (v) => v !== undefined && v !== null && v !== ""
    );
    if (!hasAny) {
      return NextResponse.json({ error: "At least one measurement value is required" }, { status: 400 });
    }

    const num = (v: unknown) => {
      const n = parseFloat(v as string);
      return isNaN(n) ? undefined : n;
    };

    const errors: string[] = [];
    for (const key of Object.keys(BOUNDS)) {
      const val = body[key];
      if (val !== undefined && val !== null && val !== "") {
        const n = parseFloat(val);
        if (isNaN(n)) {
          errors.push(`${key} must be a valid number`);
        } else {
          const err = validateBounds(key, n);
          if (err) errors.push(err);
        }
      }
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const user = await User.findOne({ _id: session.user.id }).select("heightCm").lean();

    const wKg = num(weightKg);
    const wCm = num(waistCm);
    const hCm = num(hipCm);

    let bmi: number | null = null;
    let waistToHipRatio: number | null = null;

    if (wKg && user?.heightCm) {
      const heightM = user.heightCm / 100;
      bmi = parseFloat((wKg / (heightM * heightM)).toFixed(1));
    }

    if (wCm && hCm) {
      waistToHipRatio = parseFloat((wCm / hCm).toFixed(2));
    }

    const measurement = await BodyMeasurement.create({
      userId: session.user.id,
      date: date ? new Date(date) : new Date(),
      weightKg: wKg,
      bodyFatPercent: num(bodyFatPercent),
      waistCm: wCm,
      hipCm: hCm,
      bicepCm: num(bicepCm),
      chestCm: num(chestCm),
      thighCm: num(thighCm),
      neckCm: num(neckCm),
      bmi,
      waistToHipRatio,
      notes: notes ? sanitizeString(notes) : undefined,
    });

    return NextResponse.json({ measurement }, { status: 201 });
  } catch (error) {
    console.error("Create measurement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

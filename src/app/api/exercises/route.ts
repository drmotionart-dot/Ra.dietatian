import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Exercise } from "@/models";
import { auth } from "@/lib/auth";

const PRESET_EXERCISES = [
  { name: "Bench Press", nameAr: "بنش بريس", category: "strength", muscleGroup: "chest", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Incline Bench Press", nameAr: "بنش بريس مائل", category: "strength", muscleGroup: "chest", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Dumbbell Flyes", nameAr: "فلايز بالدمبل", category: "strength", muscleGroup: "chest", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Push-ups", nameAr: "تمارين الضغط", category: "strength", muscleGroup: "chest", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Squat", nameAr: "سكات", category: "strength", muscleGroup: "legs", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Deadlift", nameAr: "ديدلفت", category: "strength", muscleGroup: "back", equipment: "barbell", difficulty: "advanced", isPreset: true },
  { name: "Barbell Row", nameAr: "رو بالبار", category: "strength", muscleGroup: "back", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Pull-ups", nameAr: "تمارين السحب", category: "strength", muscleGroup: "back", equipment: "none", difficulty: "intermediate", isPreset: true },
  { name: "Lat Pulldown", nameAr: "لات بولداون", category: "strength", muscleGroup: "back", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Overhead Press", nameAr: "أوفربريس", category: "strength", muscleGroup: "shoulders", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Lateral Raise", nameAr: "رفعة جانبية", category: "strength", muscleGroup: "shoulders", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Front Raise", nameAr: "رفعة أمامية", category: "strength", muscleGroup: "shoulders", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Bicep Curl", nameAr: " curliceps", category: "strength", muscleGroup: "arms", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Tricep Pushdown", nameAr: "تروس ترايسبس", category: "strength", muscleGroup: "arms", equipment: "cable", difficulty: "beginner", isPreset: true },
  { name: "Hammer Curl", nameAr: "همر كيرل", category: "strength", muscleGroup: "arms", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Leg Press", nameAr: "لجر بريس", category: "strength", muscleGroup: "legs", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Leg Curl", nameAr: "لجر كيرل", category: "strength", muscleGroup: "legs", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Leg Extension", nameAr: "تمديد الساق", category: "strength", muscleGroup: "legs", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Calf Raise", nameAr: "رفع السمانة", category: "strength", muscleGroup: "legs", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Plank", nameAr: "بلانك", category: "core", muscleGroup: "core", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Crunches", nameAr: "كرنش", category: "core", muscleGroup: "core", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Russian Twist", nameAr: "لف روسي", category: "core", muscleGroup: "core", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Leg Raises", nameAr: "رفع الأرجل", category: "core", muscleGroup: "core", equipment: "none", difficulty: "intermediate", isPreset: true },
  { name: "Treadmill Running", nameAr: "جري على السير", category: "cardio", muscleGroup: "cardio", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Cycling", nameAr: "دراجة", category: "cardio", muscleGroup: "cardio", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Jump Rope", nameAr: "القفز بالحبل", category: "cardio", muscleGroup: "cardio", equipment: "none", difficulty: "intermediate", isPreset: true },
  { name: "Rowing Machine", nameAr: "آلة التجديف", category: "cardio", muscleGroup: "cardio", equipment: "machine", difficulty: "beginner", isPreset: true },
  { name: "Burpees", nameAr: "بيربي", category: "cardio", muscleGroup: "full_body", equipment: "none", difficulty: "intermediate", isPreset: true },
  { name: "Mountain Climbers", nameAr: "تسلق الجبال", category: "cardio", muscleGroup: "full_body", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Dumbbell Lunges", nameAr: "لانجز بالدمبل", category: "strength", muscleGroup: "legs", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Hip Thrust", nameAr: "هيب ثراست", category: "strength", muscleGroup: "glutes", equipment: "barbell", difficulty: "intermediate", isPreset: true },
  { name: "Glute Bridge", nameAr: "جسر الأرداف", category: "strength", muscleGroup: "glutes", equipment: "none", difficulty: "beginner", isPreset: true },
  { name: "Face Pull", nameAr: "فيس بول", category: "strength", muscleGroup: "shoulders", equipment: "cable", difficulty: "beginner", isPreset: true },
  { name: "Shrugs", nameAr: "شروعز", category: "strength", muscleGroup: "shoulders", equipment: "dumbbell", difficulty: "beginner", isPreset: true },
  { name: "Dips", nameAr: "ديبس", category: "strength", muscleGroup: "chest", equipment: "none", difficulty: "intermediate", isPreset: true },
];

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const muscleGroup = searchParams.get("muscleGroup");

    await connectDB();

    const filter: Record<string, unknown> = { isPreset: true };
    if (query) {
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { nameAr: { $regex: safe, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (muscleGroup) filter.muscleGroup = muscleGroup;

    let exercises = await Exercise.find(filter).sort({ name: 1 }).lean();

    if (session?.user?.id) {
      const userExercises = await Exercise.find({
        userId: session.user.id,
        ...(query ? { $or: [{ name: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { nameAr: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }] } : {}),
        ...(category ? { category } : {}),
        ...(muscleGroup ? { muscleGroup } : {}),
      }).sort({ name: 1 }).lean();
      exercises = [...exercises, ...userExercises];
    }

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Get exercises error:", error);
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
    const { name, nameAr, category, muscleGroup, equipment, difficulty } = body;

    if (!name || !category || !muscleGroup) {
      return NextResponse.json({ error: "Name, category, and muscleGroup are required" }, { status: 400 });
    }

    const exercise = await Exercise.create({
      name,
      nameAr,
      category,
      muscleGroup,
      equipment: equipment || "none",
      difficulty: difficulty || "beginner",
      isPreset: false,
      userId: session.user.id,
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    console.error("Create exercise error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function seedExercises() {
  await connectDB();
  const count = await Exercise.countDocuments({ isPreset: true });
  if (count === 0) {
    await Exercise.insertMany(PRESET_EXERCISES);
  }
}

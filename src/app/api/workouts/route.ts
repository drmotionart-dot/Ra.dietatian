import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WorkoutSession } from "@/models";
import { auth } from "@/lib/auth";
import { seedExercises } from "../exercises/route";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await seedExercises();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20") || 20, 100);
    const startDateStr = searchParams.get("startDate");

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (startDateStr) {
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);
      filter.date = { $gte: startDate };
    }

    const sessions = await WorkoutSession.find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    const totalSessions = await WorkoutSession.countDocuments({ userId: session.user.id });

    return NextResponse.json({ sessions, totalSessions });
  } catch (error) {
    console.error("Get workouts error:", error);
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
    const { name, date, duration, notes, feeling, sets } = body;

    if (!sets?.length) {
      return NextResponse.json({ error: "At least one set is required" }, { status: 400 });
    }

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    const validSets = sets.map((s: Record<string, unknown>, i: number) => {
      const reps = (s.reps as number) || 0;
      const weight = (s.weight as number) || 0;
      totalSets++;
      totalReps += reps;
      totalVolume += weight * reps;
      return {
        exerciseId: s.exerciseId as string,
        exerciseName: s.exerciseName as string,
        setNumber: (s.setNumber as number) || i + 1,
        reps,
        weight,
        weightUnit: (s.weightUnit as string) || "kg",
        duration: s.duration as number | undefined,
        rpe: s.rpe as number | undefined,
        notes: s.notes ? sanitizeString(s.notes as string) : undefined,
        isWarmup: (s.isWarmup as boolean) || false,
        isDropset: (s.isDropset as boolean) || false,
      };
    });

    const workout = await WorkoutSession.create({
      userId: session.user.id,
      name: name ? sanitizeString(name) : "Workout",
      date: date ? new Date(date) : new Date(),
      duration,
      totalVolume,
      totalSets,
      totalReps,
      notes: notes ? sanitizeString(notes) : undefined,
      feeling: feeling || "good",
      sets: validSets,
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error("Create workout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Workout ID is required" }, { status: 400 });
    }

    const result = await WorkoutSession.deleteOne({ _id: id, userId: session.user.id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete workout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

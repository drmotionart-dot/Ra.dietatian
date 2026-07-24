import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PersonalRecord } from "@/models";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pipeline = [
      { $match: { userId: session.user.id } },
      { $sort: { date: -1 as const } },
      {
        $group: {
          _id: { exerciseId: "$exerciseId", type: "$type" },
          value: { $first: "$value" },
          date: { $first: "$date" },
          exerciseName: { $first: "$exerciseName" },
          workoutSessionId: { $first: "$workoutSessionId" },
        },
      },
      {
        $project: {
          _id: 0,
          exerciseId: "$_id.exerciseId",
          type: "$_id.type",
          value: 1,
          date: 1,
          exerciseName: 1,
          workoutSessionId: 1,
        },
      },
      { $sort: { date: -1 as const } },
    ];

    const records = await PersonalRecord.aggregate(pipeline);

    const byExercise: Record<string, Record<string, { value: number; date: string; exerciseName: string }>> = {};
    for (const r of records) {
      if (!byExercise[r.exerciseId]) byExercise[r.exerciseId] = {};
      byExercise[r.exerciseId][r.type] = {
        value: r.value,
        date: r.date,
        exerciseName: r.exerciseName,
      };
    }

    return NextResponse.json({ records: byExercise, flat: records });
  } catch (error) {
    console.error("Get PRs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

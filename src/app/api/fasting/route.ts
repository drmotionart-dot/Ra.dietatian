import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FastingPreference, FastingLog } from "@/models";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let prefs = await FastingPreference.findOne({ userId: session.user.id }).lean();
    if (!prefs) {
      prefs = await FastingPreference.create({ userId: session.user.id });
    }

    const logs = await FastingLog.find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    const totalDays = logs.length;
    const completedDays = logs.filter((l) => l.completed).length;
    let streak = 0;
    for (const log of logs) {
      if (log.completed) streak++;
      else break;
    }

    return NextResponse.json({ preferences: prefs, logs, stats: { totalDays, completedDays, streak } });
  } catch (error) {
    console.error("Get fasting error:", error);
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

    if (body.type === "preferences") {
      const { type: _, ...prefs } = body;
      const updated = await FastingPreference.findOneAndUpdate(
        { userId: session.user.id },
        { $set: prefs },
        { new: true, upsert: true }
      ).lean();
      return NextResponse.json({ preferences: updated });
    }

    if (body.type === "log") {
      const existing = await FastingLog.findOne({
        userId: session.user.id,
        date: {
          $gte: new Date(new Date(body.date || Date.now()).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(body.date || Date.now()).setHours(23, 59, 59, 999)),
        },
      });

      let log;
      if (existing) {
        log = await FastingLog.findOneAndUpdate(
          { _id: existing._id },
          { $set: body.data || body },
          { new: true }
        ).lean();
      } else {
        log = await FastingLog.create({
          userId: session.user.id,
          fastingType: body.fastingType || "ramadan",
          ...body.data,
        });
      }

      return NextResponse.json({ log }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Create fasting error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FastingPreference, FastingLog, User } from "@/models";
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
      const user = await User.findOne({ _id: session.user.id })
        .select("fastingCity fastingCountry suhoorTime iftarTime")
        .lean();
      prefs = await FastingPreference.create({
        userId: session.user.id,
        city: user?.fastingCity || "Cairo",
        country: user?.fastingCountry || "Egypt",
        suhoorTime: user?.suhoorTime || "03:30",
        iftarTime: user?.iftarTime || "19:00",
      });
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
      const allowed = [
        "ramadanEnabled", "sunnahMondayThursday", "sunnahAyyamAlBeed",
        "sunnahSixDaysShawwal", "city", "suhoorTime", "iftarTime",
      ];
      const updates: Record<string, unknown> = {};
      for (const key of allowed) {
        if (key in body) updates[key] = body[key];
      }
      const updated = await FastingPreference.findOneAndUpdate(
        { userId: session.user.id },
        { $set: updates },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      return NextResponse.json({ preferences: updated });
    }

    if (body.type === "log") {
      const dateQuery = (() => {
        const d = body.date ? new Date(body.date) : new Date();
        if (isNaN(d.getTime())) return null;
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        return { $gte: start, $lt: end };
      })();
      if (!dateQuery) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }

      const existing = await FastingLog.findOne({
        userId: session.user.id,
        date: dateQuery,
      });

      const logData = {
        fastingType: body.fastingType || "ramadan",
        completed: !!body.completed,
        suhoorTime: body.suhoorTime,
        iftarTime: body.iftarTime,
      };

      let log;
      if (existing) {
        log = await FastingLog.findOneAndUpdate(
          { _id: existing._id },
          { $set: logData },
          { new: true }
        ).lean();
      } else {
        const logDate = body.date ? new Date(body.date) : new Date();
        logDate.setHours(0, 0, 0, 0);
        log = await FastingLog.create({
          userId: session.user.id,
          date: logDate,
          ...logData,
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

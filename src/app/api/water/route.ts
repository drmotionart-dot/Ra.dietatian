import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { WaterLog } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const date = dateStr ? new Date(dateStr) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await WaterLog.find({
      userId: session.user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: 1 }).lean();

    const totalMl = logs.reduce((sum, log) => sum + (log.amountMl || 0), 0);

    return NextResponse.json({ logs, totalMl, goalMl: 2500 });
  } catch (error) {
    console.error("Get water error:", error);
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
    const { amountMl, note, date } = body;

    if (!amountMl || amountMl <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    const logDate = date ? new Date(date) : new Date();

    const log = await WaterLog.create({
      userId: session.user.id,
      date: logDate,
      amountMl,
      note,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Create water error:", error);
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
      return NextResponse.json({ error: "Water log ID is required" }, { status: 400 });
    }

    await WaterLog.deleteOne({ _id: id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete water error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

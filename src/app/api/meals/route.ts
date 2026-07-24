import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MealLog, MealLogItem } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (startDateStr) {
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);
      const endDate = endDateStr ? new Date(endDateStr) : new Date();
      endDate.setHours(23, 59, 59, 999);

      if (isNaN(startDate.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }

      const mealLogs = await MealLog.find({
        userId: session.user.id,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: -1 }).lean();

      const items = mealLogs.length > 0
        ? await MealLogItem.find({ mealLogId: { $in: mealLogs.map((l) => l._id) } }).lean()
        : [];

      const itemsByLog = new Map<string, typeof items>();
      for (const item of items) {
        const logId = item.mealLogId.toString();
        if (!itemsByLog.has(logId)) itemsByLog.set(logId, []);
        itemsByLog.get(logId)!.push(item);
      }

      const logsWithItems = mealLogs.map((log) => ({
        ...log,
        items: itemsByLog.get(log._id.toString()) || [],
      }));

      const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      for (const log of logsWithItems) {
        for (const item of log.items) {
          totals.calories += (item as Record<string, unknown>).calories as number || 0;
          totals.protein += (item as Record<string, unknown>).protein as number || 0;
          totals.carbs += (item as Record<string, unknown>).carbs as number || 0;
          totals.fat += (item as Record<string, unknown>).fat as number || 0;
        }
      }

      return NextResponse.json({ mealLogs: logsWithItems, totals, isRange: true });
    }

    const dateStr = searchParams.get("date");
    const date = dateStr ? new Date(dateStr) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const mealLogs = await MealLog.find({
      userId: session.user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: 1 }).lean();

    const mealLogIds = mealLogs.map((log) => log._id.toString());
    const items = mealLogIds.length > 0
      ? await MealLogItem.find({ mealLogId: { $in: mealLogIds } }).lean()
      : [];

    const itemsByLog: Record<string, typeof items> = {};
    for (const item of items) {
      const logId = item.mealLogId;
      if (!itemsByLog[logId]) itemsByLog[logId] = [];
      itemsByLog[logId].push(item);
    }

    const mealLogsWithItems = mealLogs.map((log) => ({
      ...log,
      items: itemsByLog[log._id.toString()] || [],
    }));

    const totals = mealLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.totalCalories || 0),
        protein: acc.protein + (log.totalProtein || 0),
        carbs: acc.carbs + (log.totalCarbs || 0),
        fat: acc.fat + (log.totalFat || 0),
        fiber: acc.fiber + (log.totalFiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    return NextResponse.json({ mealLogs: mealLogsWithItems, totals, isRange: false });
  } catch (error) {
    console.error("Get meal logs error:", error);
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
    const { date, mealType, items } = body;

    if (!mealType || !items?.length) {
      return NextResponse.json({ error: "Meal type and items are required" }, { status: 400 });
    }

    const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
    if (!validMealTypes.includes(mealType)) {
      return NextResponse.json({ error: "Invalid meal type" }, { status: 400 });
    }

    const validItems = items.filter(
      (item: Record<string, unknown>) => item.refId && typeof item.quantity === "number" && item.quantity > 0
    );
    if (validItems.length === 0) {
      return NextResponse.json({ error: "At least one valid item with refId and quantity is required" }, { status: 400 });
    }

    const logDate = date ? new Date(date) : new Date();
    if (isNaN(logDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const startOfDay = new Date(logDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(logDate);
    endOfDay.setHours(23, 59, 59, 999);

    const newItems = validItems.map((item: Record<string, unknown>) => ({
      refType: (item.refType as string) || "food",
      refId: item.refId as string,
      foodId: item.foodId as string | undefined,
      quantity: item.quantity as number,
      unit: (item.unit as string) || "g",
      servingWeight: item.servingWeight as number | undefined,
      calories: (item.calories as number) || 0,
      protein: (item.protein as number) || 0,
      carbs: (item.carbs as number) || 0,
      fat: (item.fat as number) || 0,
      fiber: (item.fiber as number) || 0,
    }));

    const newTotals = newItems.reduce(
      (acc: Record<string, number>, item: Record<string, number>) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
        fiber: acc.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    let mealLog = await MealLog.findOne({
      userId: session.user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
      mealType,
    });

    if (mealLog) {
      mealLog.totalCalories += newTotals.calories;
      mealLog.totalProtein += newTotals.protein;
      mealLog.totalCarbs += newTotals.carbs;
      mealLog.totalFat += newTotals.fat;
      mealLog.totalFiber += newTotals.fiber;
      await mealLog.save();
    } else {
      mealLog = await MealLog.create({
        userId: session.user.id,
        date: logDate,
        mealType,
        totalCalories: newTotals.calories,
        totalProtein: newTotals.protein,
        totalCarbs: newTotals.carbs,
        totalFat: newTotals.fat,
        totalFiber: newTotals.fiber,
      });
    }

    const mealLogId = mealLog._id.toString();
    const logItems = newItems.map((item: Record<string, unknown>) => ({
      mealLogId,
      refType: item.refType || "food",
      refId: item.refId,
      foodId: item.foodId,
      quantity: item.quantity || 100,
      unit: item.unit || "g",
      servingWeight: item.servingWeight,
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0,
      fiber: item.fiber || 0,
    }));
    await MealLogItem.insertMany(logItems);

    const allItems = await MealLogItem.find({ mealLogId }).lean();

    return NextResponse.json({ mealLog: { ...mealLog.toObject(), items: allItems } }, { status: 201 });
  } catch (error) {
    console.error("Create meal log error:", error);
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
      return NextResponse.json({ error: "Meal log ID is required" }, { status: 400 });
    }

    const existing = await MealLog.findOne({ _id: id, userId: session.user.id }).lean();

    if (!existing) {
      return NextResponse.json({ error: "Meal log not found" }, { status: 404 });
    }

    await MealLogItem.deleteMany({ mealLogId: id });
    await MealLog.deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete meal log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, BodyMeasurement, MealLog } from "@/models";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const user = await User.findOne({ _id: userId })
      .select("name sex dateOfBirth heightCm activityLevel goal targetWeightKg")
      .lean();

    let dailyCalorieTarget = 2000;
    let proteinTarget = 50;
    let carbsTarget = 275;
    let fatTarget = 78;

    if (user?.heightCm && user?.activityLevel && user?.sex) {
      const latestMeasurement = await BodyMeasurement.findOne({ userId })
        .sort({ date: -1 })
        .select("weightKg")
        .lean();

      if (latestMeasurement?.weightKg) {
        const age = user.dateOfBirth
          ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : 25;

        let bmr: number;
        if (user.sex === "male") {
          bmr = 10 * latestMeasurement.weightKg + 6.25 * user.heightCm - 5 * age + 5;
        } else {
          bmr = 10 * latestMeasurement.weightKg + 6.25 * user.heightCm - 5 * age - 161;
        }

        dailyCalorieTarget = Math.round(bmr * user.activityLevel);

        if (user.goal === "lose") {
          dailyCalorieTarget = Math.round(dailyCalorieTarget * 0.8);
        } else if (user.goal === "gain") {
          dailyCalorieTarget = Math.round(dailyCalorieTarget * 1.15);
        }

        proteinTarget = Math.round(latestMeasurement.weightKg * 1.6);
        fatTarget = Math.round((dailyCalorieTarget * 0.25) / 9);
        carbsTarget = Math.round((dailyCalorieTarget - proteinTarget * 4 - fatTarget * 9) / 4);
      }
    }

    const todayMeals = await MealLog.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: 1 }).lean();

    const consumed = todayMeals.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.totalCalories || 0),
        protein: acc.protein + (log.totalProtein || 0),
        carbs: acc.carbs + (log.totalCarbs || 0),
        fat: acc.fat + (log.totalFat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const latestMeasurement = await BodyMeasurement.findOne({ userId })
      .sort({ date: -1 })
      .lean();

    const recentMeals = await MealLog.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const daysWithMeals = await MealLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: thirtyDaysAgo, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
    ]);

    const uniqueDays = new Set(daysWithMeals.map((m: { _id: string }) => m._id));
    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (uniqueDays.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      user,
      targets: {
        calories: dailyCalorieTarget,
        protein: proteinTarget,
        carbs: carbsTarget,
        fat: fatTarget,
      },
      consumed,
      remaining: {
        calories: dailyCalorieTarget - consumed.calories,
        protein: proteinTarget - consumed.protein,
        carbs: carbsTarget - consumed.carbs,
        fat: fatTarget - consumed.fat,
      },
      latestMeasurement,
      recentMeals,
      streak,
      todayMeals,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

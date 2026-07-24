import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NotificationPreference, WaterLog, MealLog, WorkoutSession, User } from "@/models";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || ""}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    let sent = 0;

    const allPrefs = await NotificationPreference.find({ pushEnabled: true }).lean();

    for (const prefs of allPrefs) {
      const userId = prefs.userId;
      const user = await User.findOne({ _id: userId }).lean();
      if (!user) continue;

      if (prefs.waterRemindersEnabled) {
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayLogs = await WaterLog.countDocuments({
          userId,
          date: { $gte: todayStart },
        });
        if (todayLogs === 0 && hour >= 8 && hour <= 21) {
          const result = await sendPushToUser(userId, {
            title: "Stay Hydrated",
            body: "You haven't logged any water today. Stay hydrated!",
            url: "/water",
            tag: "water-reminder",
          });
          sent += result;
        }
      }

      if (prefs.mealRemindersEnabled) {
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayMeals = await MealLog.countDocuments({
          userId,
          date: { $gte: todayStart },
        });
        if (todayMeals === 0 && hour >= 12 && hour <= 14) {
          const result = await sendPushToUser(userId, {
            title: "Lunch Time",
            body: "Don't forget to log your lunch!",
            url: "/meals",
            tag: "meal-reminder",
          });
          sent += result;
        }
      }

      if (prefs.fastingRemindersEnabled) {
        const suhoorHour = parseInt((user.suhoorTime || "03:30").split(":")[0]);
        const iftarHour = parseInt((user.iftarTime || "19:00").split(":")[0]);
        if (hour === suhoorHour - 1 && minute === 0) {
          const result = await sendPushToUser(userId, {
            title: "Suhoor Reminder",
            body: "Suhoor is in 1 hour. Prepare your pre-dawn meal.",
            url: "/fasting",
            tag: "suhoor-reminder",
          });
          sent += result;
        }
        if (hour === iftarHour && minute === 0) {
          const result = await sendPushToUser(userId, {
            title: "Iftar Time",
            body: "Iftar is now! Break your fast.",
            url: "/fasting",
            tag: "iftar-reminder",
          });
          sent += result;
        }
      }

      if (prefs.exerciseRemindersEnabled) {
        const today = now.getDay();
        if (prefs.exerciseDaysOfWeek?.includes(today) && hour === 8 && minute === 0) {
          const result = await sendPushToUser(userId, {
            title: "Training Time",
            body: "Time for your workout! Let's crush it.",
            url: "/training",
            tag: "exercise-reminder",
          });
          sent += result;
        }
      }
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("Send notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

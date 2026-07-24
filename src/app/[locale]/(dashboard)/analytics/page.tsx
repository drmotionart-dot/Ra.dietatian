"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Activity, Flame, Calendar } from "lucide-react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/CountUp";
import { ProgressRing } from "@/components/ProgressRing";
import { PageTransition } from "@/components/PageTransition";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DayCalories {
  day: string;
  calories: number;
  target: number;
}

interface WeightPoint {
  date: string;
  weight: number;
  bodyFat?: number;
}

interface MacroData {
  name: string;
  value: number;
  color: string;
}

interface TrainingDay {
  day: string;
  volume: number;
  sessions: number;
}

interface StreakInfo {
  current: number;
  longest: number;
  thisMonth: number;
  lastMonth: number;
  heatmap: Array<{ day: string; count: number }>;
}

interface MonthlyCompare {
  thisMonth: { calories: number; workouts: number; water: number; weight: number };
  lastMonth: { calories: number; workouts: number; water: number; weight: number };
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export default function AnalyticsPage() {
  const t = useTranslations();
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<DayCalories[]>([]);
  const [weightData, setWeightData] = useState<WeightPoint[]>([]);
  const [macroData, setMacroData] = useState<MacroData[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingDay[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({ current: 0, longest: 0, thisMonth: 0, lastMonth: 0, heatmap: [] });
  const [monthlyCompare, setMonthlyCompare] = useState<MonthlyCompare | null>(null);
  const [topExercises, setTopExercises] = useState<Array<{ name: string; sessions: number; volume: number }>>([]);

  useEffect(() => {
    const days = dateRange === "7d" ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
    const dayNames = [t("days.sun"), t("days.mon"), t("days.tue"), t("days.wed"), t("days.thu"), t("days.fri"), t("days.sat")];

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date(monthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date(monthStart);
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(23, 59, 59, 999);

    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()).catch(() => ({})),
      fetch(`/api/meals?startDate=${startDateStr}&endDate=${endDateStr}`).then((r) => r.json()).catch(() => ({ totals: {}, mealLogs: [] })),
      fetch("/api/body-measurements?limit=30").then((r) => r.json()).catch(() => ({ measurements: [] })),
      fetch(`/api/workouts?limit=60`).then((r) => r.json()).catch(() => ({ sessions: [] })),
      fetch("/api/water").then((r) => r.json()).catch(() => ({ logs: [] })),
      fetch("/api/personal-records").then((r) => r.json()).catch(() => ({ flat: [] })),
    ]).then(([dashData, mealsData, bodyData, workoutsData, waterData]) => {
      const calorieTarget = dashData.targets?.calories || 2000;
      const totals = mealsData.totals || {};
      const mealLogs = mealsData.mealLogs || [];
      const workouts = workoutsData.sessions || [];
      const measurements = bodyData.measurements || [];
      const waterLogs = waterData.logs || [];

      const dayCalories: Record<string, number> = {};
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayCalories[d.toISOString().split("T")[0]] = 0;
      }
      for (const log of mealLogs) {
        const logDate = new Date(log.date).toISOString().split("T")[0];
        if (logDate in dayCalories) {
          for (const item of log.items || []) {
            dayCalories[logDate] += (item.calories as number) || 0;
          }
        }
      }
      setWeeklyData(Object.entries(dayCalories).map(([dateStr, cal]) => {
        const d = new Date(dateStr + "T12:00:00");
        return { day: dayNames[d.getDay()], calories: Math.round(cal), target: calorieTarget };
      }));

      const wData: WeightPoint[] = [];
      for (const m of [...measurements].reverse()) {
        if (m.weightKg) {
          wData.push({
            date: new Date(m.date).toLocaleDateString(),
            weight: m.weightKg,
            bodyFat: m.bodyFatPercent,
          });
        }
      }
      setWeightData(wData);

      const totalP = totals.protein || 0;
      const totalC = totals.carbs || 0;
      const totalF = totals.fat || 0;
      const total = totalP + totalC + totalF;
      if (total > 0) {
        setMacroData([
          { name: t("meals.proteinLabel"), value: Math.round((totalP / total) * 100), color: COLORS[0] },
          { name: t("meals.carbsLabel"), value: Math.round((totalC / total) * 100), color: COLORS[1] },
          { name: t("meals.fatLabel"), value: Math.round((totalF / total) * 100), color: COLORS[2] },
        ]);
      }

      const trainByDay: Record<string, { volume: number; sessions: number }> = {};
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trainByDay[d.toISOString().split("T")[0]] = { volume: 0, sessions: 0 };
      }
      const exerciseCount: Record<string, { sessions: number; volume: number }> = {};
      for (const ws of workouts) {
        const wDate = new Date(ws.date).toISOString().split("T")[0];
        if (trainByDay[wDate]) {
          trainByDay[wDate].volume += ws.totalVolume || 0;
          trainByDay[wDate].sessions += 1;
        }
        for (const set of ws.sets || []) {
          const name = set.exerciseName || set.exerciseId;
          if (!exerciseCount[name]) exerciseCount[name] = { sessions: 0, volume: 0 };
          exerciseCount[name].sessions += 1;
          exerciseCount[name].volume += (set.weight || 0) * (set.reps || 0);
        }
      }
      setTrainingData(Object.entries(trainByDay).map(([dateStr, data]) => {
        const d = new Date(dateStr + "T12:00:00");
        return { day: dayNames[d.getDay()], volume: Math.round(data.volume), sessions: data.sessions };
      }));

      setTopExercises(
        Object.entries(exerciseCount)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 5)
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const heatmap: Array<{ day: string; count: number }> = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        let count = 0;
        if (dayCalories[dateStr] && dayCalories[dateStr] > 0) count++;
        for (const ws of workouts) {
          if (new Date(ws.date).toISOString().split("T")[0] === dateStr) count++;
        }
        for (const wl of waterLogs) {
          if (new Date(wl.date).toISOString().split("T")[0] === dateStr) count++;
        }
        heatmap.push({ day: dateStr, count });
      }

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      for (let i = heatmap.length - 1; i >= 0; i--) {
        if (heatmap[i].count > 0) {
          tempStreak++;
          if (i === heatmap.length - 1 || currentStreak > 0) currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          if (i < heatmap.length - 1) tempStreak = 0;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      const thisMonthLogs = waterLogs.filter((l: { date: string }) => new Date(l.date) >= monthStart);
      const lastMonthLogs = waterLogs.filter((l: { date: string }) => {
        const d = new Date(l.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      });

      setStreakInfo({
        current: currentStreak,
        longest: longestStreak,
        thisMonth: thisMonthLogs.length,
        lastMonth: lastMonthLogs.length,
        heatmap,
      });

      const thisMonthWorkouts = workouts.filter((ws: { date: string }) => new Date(ws.date) >= monthStart);
      const lastMonthWorkouts = workouts.filter((ws: { date: string }) => {
        const d = new Date(ws.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      });
      const thisMonthMeals = mealLogs.filter((ml: { date: string }) => new Date(ml.date) >= monthStart);
      const lastMonthMeals = mealLogs.filter((ml: { date: string }) => {
        const d = new Date(ml.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      });

      const latestWeight = measurements[0]?.weightKg || 0;
      const monthAgoWeight = measurements.find((m: { weightKg?: number; date: string }) => {
        const d = new Date(m.date);
        return d >= lastMonthStart && d <= lastMonthEnd && m.weightKg;
      })?.weightKg || latestWeight;

      setMonthlyCompare({
        thisMonth: {
          calories: Math.round(thisMonthMeals.reduce((s: number, ml: { items?: Array<{ calories?: number }> }) => s + (ml.items?.reduce((is2: number, item: { calories?: number }) => is2 + (item.calories || 0), 0) || 0), 0)),
          workouts: thisMonthWorkouts.length,
          water: thisMonthLogs.length,
          weight: latestWeight,
        },
        lastMonth: {
          calories: Math.round(lastMonthMeals.reduce((s: number, ml: { items?: Array<{ calories?: number }> }) => s + (ml.items?.reduce((is2: number, item: { calories?: number }) => is2 + (item.calories || 0), 0) || 0), 0)),
          workouts: lastMonthWorkouts.length,
          water: lastMonthLogs.length,
          weight: monthAgoWeight,
        },
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [dateRange, t]);

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const totalTarget = weeklyData.reduce((sum, day) => sum + day.target, 0);
  const adherenceScore = totalTarget > 0 ? Math.round((1 - Math.abs(totalCalories - totalTarget) / totalTarget) * 100) : 0;

  if (loading) return <PageSkeleton />;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageTransition>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("analytics.analytics")}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant={dateRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setDateRange("7d")}>
            {t("analytics.last7Days")}
          </Button>
          <Button variant={dateRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setDateRange("30d")}>
            {t("analytics.last30Days")}
          </Button>
        </div>
      </div>
      </PageTransition>

      <div className="stagger-enter">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <ProgressRing value={adherenceScore} max={100} size={100} strokeWidth={8} color="var(--primary)">
              <CountUp to={adherenceScore} suffix="%" className="text-2xl font-bold text-primary" />
            </ProgressRing>
            <h3 className="mt-4 text-lg font-medium">{t("analytics.adherenceScore")}</h3>
            <p className="text-sm text-muted-foreground">
              {adherenceScore >= 80 ? t("analytics.greatOnTrack") : t("analytics.tryToStickCloser")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold text-primary"><CountUp to={streakInfo.current} /></div>
            <div className="text-xs text-muted-foreground">{t("analytics.currentStreak") || "Current Streak"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold text-primary"><CountUp to={streakInfo.longest} /></div>
            <div className="text-xs text-muted-foreground">{t("analytics.longestStreak") || "Longest Streak"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold text-primary"><CountUp to={streakInfo.thisMonth} /></div>
            <div className="text-xs text-muted-foreground">{t("analytics.activeDays") || "Active Days"}</div>
          </CardContent>
        </Card>
      </div>
      </div>

      <Tabs defaultValue="calories">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calories">{t("analytics.caloriesTrend")}</TabsTrigger>
          <TabsTrigger value="training">{t("analytics.trainingTrend") || "Training"}</TabsTrigger>
          <TabsTrigger value="weight">{t("analytics.weightTrend")}</TabsTrigger>
          <TabsTrigger value="macros">{t("analytics.macroTrend")}</TabsTrigger>
          <TabsTrigger value="compare">{t("analytics.monthlyCompare") || "Compare"}</TabsTrigger>
        </TabsList>

        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("analytics.caloriesTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calories" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="var(--chart-4)" strokeDasharray="5 5" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("analytics.trainingVolume") || "Training Volume"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {trainingData.some((d) => d.volume > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="volume" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {t("analytics.noTrainingData") || "No training data yet"}
                  </div>
                )}
              </div>
              {topExercises.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">{t("analytics.topExercises") || "Top Exercises"}</h4>
                  {topExercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{ex.name}</span>
                      <span className="text-muted-foreground">{ex.sessions} {t("training.sets") || "sets"} · {ex.volume.toLocaleString()} kg</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("analytics.weightTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {weightData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t("analytics.noWeightData")}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: "var(--chart-1)" }} name={t("body.weight") + " (kg)"} />
                      {weightData.some((d) => d.bodyFat) && (
                        <Line type="monotone" dataKey="bodyFat" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: "var(--chart-2)" }} name={t("body.bodyFat") + " (%)"} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.macroTrend")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                {macroData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    {t("analytics.noMealData")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          {monthlyCompare && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("analytics.monthlyCompare") || "Monthly Comparison"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: t("analytics.totalCalories") || "Total Calories", thisVal: monthlyCompare.thisMonth.calories, lastVal: monthlyCompare.lastMonth.calories, unit: "kcal" },
                    { label: t("training.totalWorkouts") || "Workouts", thisVal: monthlyCompare.thisMonth.workouts, lastVal: monthlyCompare.lastMonth.workouts, unit: "" },
                    { label: t("water.title") || "Water Logs", thisVal: monthlyCompare.thisMonth.water, lastVal: monthlyCompare.lastMonth.water, unit: "" },
                    { label: t("body.weight") || "Weight", thisVal: monthlyCompare.thisMonth.weight, lastVal: monthlyCompare.lastMonth.weight, unit: "kg" },
                  ].map((item, i) => {
                    const diff = item.thisVal - item.lastVal;
                    const pct = item.lastVal > 0 ? Math.round((diff / item.lastVal) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.thisVal} {item.unit}</p>
                        </div>
                        <div className={`text-sm font-medium ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                          {diff > 0 ? "+" : ""}{pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

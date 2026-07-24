"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const t = useTranslations();
  const [dateRange, setDateRange] = useState("7d");
  const [weeklyData, setWeeklyData] = useState<Array<{ day: string; calories: number; target: number }>>([]);
  const [weightData, setWeightData] = useState<Array<{ week: string; weight: number }>>([]);
  const [macroData, setMacroData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loading, setLoading] = useState(true);

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

    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()).then((d) => d.targets?.calories || 0).catch(() => 0),
      fetch(`/api/meals?startDate=${startDateStr}&endDate=${endDateStr}`).then((r) => r.json()).catch(() => ({ totals: {}, mealLogs: [] })),
      fetch("/api/body-measurements?limit=30").then((r) => r.json()).catch(() => ({ measurements: [] })),
    ]).then(([calorieTarget, mealsData, bodyData]) => {
      const totals = mealsData.totals || {};
      const mealLogs = mealsData.mealLogs || [];

      const totalProtein = totals.protein || 0;
      const totalCarbs = totals.carbs || 0;
      const totalFat = totals.fat || 0;

      const dayCalories: Record<string, number> = {};
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        dayCalories[dateStr] = 0;
      }

      for (const log of mealLogs) {
        const logDate = new Date(log.date).toISOString().split("T")[0];
        if (logDate in dayCalories) {
          for (const item of (log.items || [])) {
            dayCalories[logDate] += (item as Record<string, unknown>).calories as number || 0;
          }
        }
      }

      const weekCalories = Object.entries(dayCalories).map(([dateStr, cal]) => {
        const d = new Date(dateStr + "T12:00:00");
        return { day: dayNames[d.getDay()], calories: cal, target: calorieTarget };
      });

      const weekWeight: { week: string; weight: number }[] = [];
      const measurements = (bodyData.measurements || []).reverse();
      measurements.forEach((m: { date: string; weightKg?: number }, i: number) => {
        if (m.weightKg) {
          weekWeight.push({ week: `#${i + 1}`, weight: m.weightKg });
        }
      });

      setWeeklyData(weekCalories);
      setWeightData(weekWeight);

      const total = totalProtein + totalCarbs + totalFat;
      if (total > 0) {
        setMacroData([
          { name: t("meals.proteinLabel"), value: Math.round((totalProtein / total) * 100), color: "var(--chart-1)" },
          { name: t("meals.carbsLabel"), value: Math.round((totalCarbs / total) * 100), color: "var(--chart-3)" },
          { name: t("meals.fatLabel"), value: Math.round((totalFat / total) * 100), color: "var(--chart-2)" },
        ]);
      } else {
        setMacroData([]);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [dateRange]);

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const totalTarget = weeklyData.reduce((sum, day) => sum + day.target, 0);
  const adherenceScore = totalTarget > 0 ? Math.round((1 - Math.abs(totalCalories - totalTarget) / totalTarget) * 100) : 0;

  if (loading) return <PageSkeleton />;

  return (
    <div className="container mx-auto p-4 space-y-6">
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

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
              <span className="text-3xl font-bold text-primary">{adherenceScore}{t("units.percent")}</span>
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("analytics.adherenceScore")}</h3>
            <p className="text-sm text-muted-foreground">
              {adherenceScore >= 80 ? t("analytics.greatOnTrack") : t("analytics.tryToStickCloser")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calories">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calories">{t("analytics.caloriesTrend")}</TabsTrigger>
          <TabsTrigger value="weight">{t("analytics.weightTrend")}</TabsTrigger>
          <TabsTrigger value="macros">{t("analytics.macroTrend")}</TabsTrigger>
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
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: "var(--chart-1)" }} />
                    <Line type="monotone" dataKey="target" stroke="var(--chart-4)" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
                      <XAxis dataKey="week" />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: "var(--chart-1)" }} />
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
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    {t("analytics.noMealData")}
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {macroData.map((macro, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-sm">{macro.name} ({macro.value}{t("units.percent")})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Target, Activity, Droplets } from "lucide-react";
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

  useEffect(() => {
    const days = dateRange === "7d" ? 7 : 30;
    const fetches: Promise<void>[] = [];
    const weekCalories: { day: string; calories: number; target: number }[] = [];
    const weekWeight: { week: string; weight: number }[] = [];
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayLabel = dayNames[d.getDay()];

      const p = fetch(`/api/meals?date=${dateStr}`)
        .then((r) => r.json())
        .then((data) => {
          const cal = data.totals?.calories || 0;
          weekCalories.push({ day: dayLabel, calories: cal, target: 2000 });
          totalProtein += data.totals?.protein || 0;
          totalCarbs += data.totals?.carbs || 0;
          totalFat += data.totals?.fat || 0;
        })
        .catch(() => {
          weekCalories.push({ day: dayLabel, calories: 0, target: 2000 });
        });
      fetches.push(p);
    }

    const weightP = fetch("/api/body-measurements?limit=30")
      .then((r) => r.json())
      .then((data) => {
        const measurements = (data.measurements || []).reverse();
        measurements.forEach((m: { date: string; weightKg?: number }, i: number) => {
          if (m.weightKg) {
            weekWeight.push({ week: `#${i + 1}`, weight: m.weightKg });
          }
        });
      })
      .catch(() => {});
    fetches.push(weightP);

    Promise.all(fetches).then(() => {
      weekCalories.sort((a, b) => {
        const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return order.indexOf(a.day) - order.indexOf(b.day);
      });
      setWeeklyData(weekCalories);
      setWeightData(weekWeight);

      const total = totalProtein + totalCarbs + totalFat;
      if (total > 0) {
        setMacroData([
          { name: "Protein", value: Math.round((totalProtein / total) * 100), color: "#3B82F6" },
          { name: "Carbs", value: Math.round((totalCarbs / total) * 100), color: "#EAB308" },
          { name: "Fat", value: Math.round((totalFat / total) * 100), color: "#EF4444" },
        ]);
      } else {
        setMacroData([
          { name: "Protein", value: 30, color: "#3B82F6" },
          { name: "Carbs", value: 45, color: "#EAB308" },
          { name: "Fat", value: 25, color: "#EF4444" },
        ]);
      }
    });
  }, [dateRange]);

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const totalTarget = weeklyData.reduce((sum, day) => sum + day.target, 0);
  const adherenceScore = totalTarget > 0 ? Math.round((1 - Math.abs(totalCalories - totalTarget) / totalTarget) * 100) : 0;

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
              <span className="text-3xl font-bold text-primary">{adherenceScore}%</span>
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("analytics.adherenceScore")}</h3>
            <p className="text-sm text-muted-foreground">
              {adherenceScore >= 80 ? "Great! You're on track" : "Try to stick closer to your target"}
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
                    <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
                    <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" />
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
                    No weight data yet. Log measurements in Body page.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
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
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {macroData.map((macro, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-sm">{macro.name} ({macro.value}%)</span>
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

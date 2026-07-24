"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Target, TrendingUp, Utensils, Scale, Moon, ChefHat, Dumbbell, Droplets, Plus } from "lucide-react";
import BodyVisualization from "@/components/body/BodyVisualization";
import { CountUp } from "@/components/CountUp";
import { ProgressRing } from "@/components/ProgressRing";
import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";

interface DashboardData {
  user?: { heightCm?: number; sex?: string };
  targets: { calories: number; protein: number; carbs: number; fat: number };
  consumed: { calories: number; protein: number; carbs: number; fat: number };
  remaining: { calories: number; protein: number; carbs: number; fat: number };
  streak: number;
  latestMeasurement: {
    weightKg?: number;
    bodyFatPercent?: number;
    waistCm?: number;
    hipCm?: number;
    bicepCm?: number;
    chestCm?: number;
    thighCm?: number;
    neckCm?: number;
  } | null;
  todayMeals: Array<{ mealType: string; totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number }>;
  water?: { totalMl: number; goalMl: number };
}

export default function DashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const targets = data?.targets || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const consumed = data?.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const remaining = data?.remaining || { calories: targets.calories, protein: targets.protein, carbs: targets.carbs, fat: targets.fat };
  const calorieProgress = targets.calories > 0 ? Math.min((consumed.calories / targets.calories) * 100, 100) : 0;

  const measurement = data?.latestMeasurement;
  const metrics = {
    weight: measurement?.weightKg || 0,
    height: data?.user?.heightCm || 0,
    bodyFatPercent: measurement?.bodyFatPercent || 0,
    waist: measurement?.waistCm || 0,
    hip: measurement?.hipCm || 0,
    bicep: measurement?.bicepCm || 0,
    chest: measurement?.chestCm || 0,
    thigh: measurement?.thighCm || 0,
    neck: measurement?.neckCm || 0,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">{t("common.loading")}</div>
        </div>
      ) : (<>
      <PageTransition>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.todaysSummary")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <span className="font-semibold"><CountUp to={data?.streak || 0} /> {t("dashboard.streak")}</span>
        </div>
      </div>
      </PageTransition>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-enter">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              {t("body.bodyVisualization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BodyVisualization metrics={metrics} sex={(data?.user?.sex as "male" | "female") || "male"} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("dashboard.caloriesRemaining")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <ProgressRing value={consumed.calories} max={targets.calories} size={120} strokeWidth={8} color="var(--primary)">
                  <div className="text-center">
                    <CountUp to={remaining.calories} className="text-2xl font-bold text-primary" />
                    <div className="text-[10px] text-muted-foreground">{t("dashboard.remaining") || "left"}</div>
                  </div>
                </ProgressRing>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <CountUp to={consumed.calories} className="font-semibold text-foreground" /> {t("units.kcal")} / {targets.calories} {t("units.kcal")}
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span><CountUp to={consumed.calories} className="font-medium text-foreground" /> {t("units.kcal")} {t("dashboard.eaten")}</span>
                <span>{targets.calories} {t("units.kcal")} {t("dashboard.target")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp to={remaining.protein} />{t("units.g")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("meals.proteinLabel")}
                  </div>
                  <Progress 
                    value={Math.min((consumed.protein / targets.protein) * 100, 100)} 
                    className="h-2 mt-2" 
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    <CountUp to={remaining.carbs} />{t("units.g")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("meals.carbsLabel")}
                  </div>
                  <Progress 
                    value={Math.min((consumed.carbs / targets.carbs) * 100, 100)} 
                    className="h-2 mt-2" 
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    <CountUp to={remaining.fat} />{t("units.g")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("meals.fatLabel")}
                  </div>
                  <Progress 
                    value={Math.min((consumed.fat / targets.fat) * 100, 100)} 
                    className="h-2 mt-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-6 stagger-enter">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {t("water.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-primary">
                <CountUp to={data?.water?.totalMl || 0} />
                <span className="text-sm font-normal text-muted-foreground">{t("units.ml")}</span>
              </div>
              <span className="text-muted-foreground">/ {(data?.water?.goalMl || 2500).toLocaleString()}{t("units.ml")}</span>
            </div>
            <Link href={`/${locale}/water`}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 me-1" />{t("water.logWater")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {t("dashboard.quickActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/${locale}/meals`}>
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <Utensils className="h-6 w-6" />
                <span>{t("dashboard.logMeal")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/body`}>
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <TrendingUp className="h-6 w-6" />
                <span>{t("dashboard.logWeight")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/training`}>
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <Dumbbell className="h-6 w-6" />
                <span>{t("training.title")}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/water`}>
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <Droplets className="h-6 w-6" />
                <span>{t("water.title")}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.recentMeals")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.todayMeals?.length ? (
            <div className="text-center text-muted-foreground py-8">
              {t("meals.noMealsLogged")}
            </div>
          ) : (
            <div className="space-y-2">
              {data.todayMeals.map((meal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{t(`mealTypes.${meal.mealType}`)}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("dashboard.proteinAbbr")}: {meal.totalProtein}{t("units.g")} | {t("dashboard.carbsAbbr")}: {meal.totalCarbs}{t("units.g")} | {t("dashboard.fatAbbr")}: {meal.totalFat}{t("units.g")}
                    </div>
                  </div>
                  <div className="font-semibold">{meal.totalCalories} {t("units.kcal")}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      </>)}
    </div>
  );
}

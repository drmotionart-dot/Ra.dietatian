"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Target, TrendingUp, Utensils, Scale, Moon, ChefHat, Heart } from "lucide-react";
import BodyVisualization from "@/components/body/BodyVisualization";
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
}

export default function DashboardPage() {
  const t = useTranslations();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const targets = data?.targets || { calories: 2000, protein: 120, carbs: 250, fat: 65 };
  const consumed = data?.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const remaining = data?.remaining || { calories: targets.calories, protein: targets.protein, carbs: targets.carbs, fat: targets.fat };
  const calorieProgress = Math.min((consumed.calories / targets.calories) * 100, 100);

  const measurement = data?.latestMeasurement;
  const metrics = {
    weight: measurement?.weightKg || 70,
    height: data?.user?.heightCm || 170,
    bodyFatPercent: measurement?.bodyFatPercent || 20,
    muscleMass: 35,
    waist: measurement?.waistCm || 80,
    hip: measurement?.hipCm || 95,
    bicep: measurement?.bicepCm || 30,
    chest: measurement?.chestCm || 95,
    thigh: measurement?.thighCm || 55,
    neck: measurement?.neckCm || 38,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.todaysSummary")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-semibold">{data?.streak || 0} {t("dashboard.streak")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              {t("body.bodyVisualization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BodyVisualization metrics={metrics} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("meals.caloriesRemaining")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {remaining.calories}
                </div>
                <div className="text-sm text-muted-foreground">
                  {consumed.calories} {t("units.kcal")} / {targets.calories} {t("units.kcal")}
                </div>
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{consumed.calories} {t("units.kcal")} {t("dashboard.eaten")}</span>
                <span>{targets.calories} {t("units.kcal")} {t("dashboard.target")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {remaining.protein}g
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
                  <div className="text-2xl font-bold text-yellow-500">
                    {remaining.carbs}g
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
                  <div className="text-2xl font-bold text-red-500">
                    {remaining.fat}g
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {t("dashboard.quickActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/meals">
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <Utensils className="h-6 w-6" />
                <span>{t("dashboard.logMeal")}</span>
              </Button>
            </Link>
            <Link href="/body">
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <TrendingUp className="h-6 w-6" />
                <span>{t("dashboard.logWeight")}</span>
              </Button>
            </Link>
            <Link href="/fasting">
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <Moon className="h-6 w-6" />
                <span>{t("fasting.fasting")}</span>
              </Button>
            </Link>
            <Link href="/recipes">
              <Button className="h-20 w-full flex flex-col gap-2" variant="outline">
                <ChefHat className="h-6 w-6" />
                <span>{t("recipes.recipes")}</span>
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
                    <div className="font-medium capitalize">{meal.mealType}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("dashboard.proteinAbbr")}: {meal.totalProtein}g | {t("dashboard.carbsAbbr")}: {meal.totalCarbs}g | {t("dashboard.fatAbbr")}: {meal.totalFat}g
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
  );
}

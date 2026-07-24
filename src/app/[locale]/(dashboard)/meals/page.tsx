"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Save } from "lucide-react";

interface Food {
  _id: string;
  name: string;
  nameAr?: string;
  category: string;
  nutrientProfile?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface MealItem {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

export default function MealsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const searchFoods = useCallback(async (q: string) => {
    if (!q || q.length < 1) {
      setFoods([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/foods?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setFoods(data.foods || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchFoods(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchFoods]);

  const addFoodToMeal = (food: Food) => {
    const np = food.nutrientProfile;
    const newItem: MealItem = {
      id: `${food._id}-${Date.now()}`,
      foodId: food._id,
      name: food.nameAr || food.name,
      calories: np?.calories || 0,
      protein: np?.protein || 0,
      carbs: np?.carbs || 0,
      fat: np?.fat || 0,
      quantity: 100,
      unit: "g",
    };
    setMealItems([...mealItems, newItem]);
  };

  const removeFoodFromMeal = (id: string) => {
    setMealItems(mealItems.filter((item) => item.id !== id));
  };

  const saveMeal = async () => {
    if (mealItems.length === 0) return;
    setSaving(true);
    setError("");
    try {
      const items = mealItems.map((item) => ({
        refType: "food",
        refId: item.foodId,
        foodId: item.foodId,
        quantity: item.quantity,
        unit: item.unit,
        calories: Math.round((item.calories * item.quantity) / 100),
        protein: Math.round((item.protein * item.quantity) / 100),
        carbs: Math.round((item.carbs * item.quantity) / 100),
        fat: Math.round((item.fat * item.quantity) / 100),
      }));

      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType: selectedMeal, items }),
      });

      if (!res.ok) {
        setError(t("common.error"));
        return;
      }

      setMealItems([]);
    } catch (err) {
      setError(t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const mealTotals = mealItems.reduce(
    (acc, item) => {
      const qty = item.quantity / 100;
      return {
        calories: acc.calories + Math.round(item.calories * qty),
        protein: acc.protein + Math.round(item.protein * qty),
        carbs: acc.carbs + Math.round(item.carbs * qty),
        fat: acc.fat + Math.round(item.fat * qty),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("meals.mealLogger")}</h1>

      <Tabs value={selectedMeal} onValueChange={setSelectedMeal}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakfast">{t("meals.breakfast")}</TabsTrigger>
          <TabsTrigger value="lunch">{t("meals.lunch")}</TabsTrigger>
          <TabsTrigger value="dinner">{t("meals.dinner")}</TabsTrigger>
          <TabsTrigger value="snack">{t("meals.snack")}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedMeal} className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("meals.searchFood")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
            </CardContent>
          </Card>

          {searchQuery && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("food.searchResults")} {searching && "..."}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {foods.length === 0 && !searching ? (
                  <p className="text-muted-foreground text-center py-4">
                    {t("food.noResultsFound")}
                  </p>
                ) : (
                  foods.map((food) => (
                    <div
                      key={food._id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{food.nameAr || food.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {food.nutrientProfile?.calories || 0} {t("units.kcal")} | {t("dashboard.proteinAbbr")}: {food.nutrientProfile?.protein || 0}{t("units.g")} | {t("dashboard.carbsAbbr")}: {food.nutrientProfile?.carbs || 0}{t("units.g")} | {t("dashboard.fatAbbr")}: {food.nutrientProfile?.fat || 0}{t("units.g")}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => addFoodToMeal(food)} aria-label={t("meals.addFoodToMeal", { name: food.nameAr || food.name })}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("meals.addFood")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mealItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t("meals.noMealsLogged")}
                </p>
              ) : (
                <>
                  {mealItems.map((item) => {
                    const qty = item.quantity / 100;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(item.calories * qty)} {t("units.kcal")} | {t("dashboard.proteinAbbr")}: {Math.round(item.protein * qty)}{t("units.g")} | {t("dashboard.carbsAbbr")}: {Math.round(item.carbs * qty)}{t("units.g")} | {t("dashboard.fatAbbr")}: {Math.round(item.fat * qty)}{t("units.g")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 100;
                              setMealItems(mealItems.map((mi) =>
                                mi.id === item.id ? { ...mi, quantity: newQty } : mi
                              ));
                            }}
                            className="w-20 text-center border rounded p-1 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">{t("units.g")}</span>
                          <Button size="sm" variant="ghost" onClick={() => removeFoodFromMeal(item.id)} aria-label={t("meals.removeFoodFromMeal", { name: item.name })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>{t("meals.totalCalories")}</span>
                      <span>{mealTotals.calories} {t("units.kcal")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("meals.proteinLabel")}: {mealTotals.protein}{t("units.g")}</span>
                      <span>{t("meals.carbsLabel")}: {mealTotals.carbs}{t("units.g")}</span>
                      <span>{t("meals.fatLabel")}: {mealTotals.fat}{t("units.g")}</span>
                    </div>
                    <Button className="w-full mt-4" onClick={saveMeal} disabled={saving}>
                      <Save className="h-4 w-4 me-2" />
                      {saving ? t("common.loading") : t("common.save")}
                    </Button>
                    {error && <p className="text-sm text-destructive mt-2 text-center">{error}</p>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

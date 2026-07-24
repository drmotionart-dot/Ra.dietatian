"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Save, Clock, Star, Filter } from "lucide-react";

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

const FOOD_CATEGORIES = [
  { value: "all", labelKey: "common.all" },
  { value: "grains", labelKey: "food.categories.grains" },
  { value: "vegetables", labelKey: "food.categories.vegetables" },
  { value: "fruits", labelKey: "food.categories.fruits" },
  { value: "dairy", labelKey: "food.categories.dairy" },
  { value: "protein", labelKey: "food.categories.protein" },
  { value: "legumes", labelKey: "food.categories.legumes" },
  { value: "nutsSeeds", labelKey: "food.categories.nutsSeeds" },
  { value: "oilsFats", labelKey: "food.categories.oilsFats" },
  { value: "beverages", labelKey: "food.categories.beverages" },
  { value: "snacks", labelKey: "food.categories.snacks" },
  { value: "desserts", labelKey: "food.categories.desserts" },
  { value: "condiments", labelKey: "food.categories.condiments" },
  { value: "other", labelKey: "food.categories.other" },
];

const QUICK_ADD_PORTIONS = [50, 100, 150, 200];

export default function MealsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [todayHistory, setTodayHistory] = useState<Array<{ mealType: string; totalCalories: number; date: string }>>([]);

  const searchFoods = useCallback(async (q: string, cat?: string) => {
    if (!q || q.length < 1) {
      setFoods([]);
      return;
    }
    setSearching(true);
    try {
      const params = new URLSearchParams({ q });
      if (cat && cat !== "all") params.set("category", cat);
      const res = await fetch(`/api/foods?${params}`);
      const data = await res.json();
      setFoods(data.foods || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchFoods(searchQuery, categoryFilter), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, searchFoods]);

  useEffect(() => {
    fetch("/api/meals?startDate=" + new Date().toISOString().split("T")[0])
      .then((r) => r.json())
      .then((d) => {
        const logs = (d.mealLogs || []).map((l: { mealType: string; totalCalories: number; date: string }) => ({
          mealType: l.mealType,
          totalCalories: l.totalCalories,
          date: l.date,
        }));
        setTodayHistory(logs);
      })
      .catch(console.error);

    const savedFavs = localStorage.getItem("meal-favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedRecent = localStorage.getItem("meal-recent-foods");
    if (savedRecent) setRecentFoods(JSON.parse(savedRecent));
  }, []);

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

    const recentEntry: Food = { _id: food._id, name: food.name, nameAr: food.nameAr, category: food.category, nutrientProfile: food.nutrientProfile };
    const updatedRecent = [recentEntry, ...recentFoods.filter((f) => f._id !== food._id)].slice(0, 10);
    setRecentFoods(updatedRecent);
    localStorage.setItem("meal-recent-foods", JSON.stringify(updatedRecent));
  };

  const toggleFavorite = (foodId: string) => {
    const updated = favorites.includes(foodId)
      ? favorites.filter((id) => id !== foodId)
      : [...favorites, foodId];
    setFavorites(updated);
    localStorage.setItem("meal-favorites", JSON.stringify(updated));
  };

  const removeFoodFromMeal = (id: string) => {
    setMealItems(mealItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setMealItems(mealItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    ));
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
      const mealRes = await fetch("/api/meals?startDate=" + new Date().toISOString().split("T")[0]);
      const mealData = await mealRes.json();
      setTodayHistory((mealData.mealLogs || []).map((l: { mealType: string; totalCalories: number; date: string }) => ({
        mealType: l.mealType, totalCalories: l.totalCalories, date: l.date,
      })));
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

  const renderFoodItem = (food: Food, showFav: boolean = true) => (
    <div key={food._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{food.nameAr || food.name}</div>
        <div className="text-sm text-muted-foreground">
          {food.nutrientProfile?.calories || 0} {t("units.kcal")} | {t("dashboard.proteinAbbr")}: {food.nutrientProfile?.protein || 0}{t("units.g")} | {t("dashboard.carbsAbbr")}: {food.nutrientProfile?.carbs || 0}{t("units.g")} | {t("dashboard.fatAbbr")}: {food.nutrientProfile?.fat || 0}{t("units.g")}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {showFav && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleFavorite(food._id)}
            aria-label={favorites.includes(food._id) ? "Unfavorite" : "Favorite"}
          >
            <Star className={`h-4 w-4 ${favorites.includes(food._id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => addFoodToMeal(food)} aria-label={t("meals.addFoodToMeal", { name: food.nameAr || food.name })}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
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
            <CardContent className="pt-6 space-y-3">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("meals.searchFood")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setShowCategories(!showCategories)}
              >
                <span className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4" />
                  {categoryFilter === "all" ? t("common.all") : t(`food.categories.${categoryFilter}`)}
                </span>
              </Button>
              {showCategories && (
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_CATEGORIES.map((cat) => (
                    <Badge
                      key={cat.value}
                      variant={categoryFilter === cat.value ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => { setCategoryFilter(cat.value); setShowCategories(false); }}
                    >
                      {t(cat.labelKey)}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {searchQuery ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("food.searchResults")} {searching && "..."}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {foods.length === 0 && !searching ? (
                  <p className="text-muted-foreground text-center py-4">{t("food.noResultsFound")}</p>
                ) : (
                  foods.map((food) => renderFoodItem(food))
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {recentFoods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {t("meals.recentFoods")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentFoods.slice(0, 5).map((food) => renderFoodItem(food))}
                  </CardContent>
                </Card>
              )}

              {favorites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      {t("meals.favorites")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentFoods.filter((f) => favorites.includes(f._id)).slice(0, 5).map((food) => renderFoodItem(food))}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("meals.addFood")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mealItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t("meals.noMealsLogged")}</p>
              ) : (
                <>
                  {mealItems.map((item) => {
                    const qty = item.quantity / 100;
                    return (
                      <div key={item.id} className="p-3 rounded-lg border space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.name}</div>
                          <Button size="sm" variant="ghost" onClick={() => removeFoodFromMeal(item.id)} aria-label={t("meals.removeFoodFromMeal", { name: item.name })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {QUICK_ADD_PORTIONS.map((p) => (
                            <Badge
                              key={p}
                              variant={item.quantity === p ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => updateQuantity(item.id, p)}
                            >
                              {p}{t("units.g")}
                            </Badge>
                          ))}
                          <Input
                            type="number"
                            min="1"
                            max="10000"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 100)}
                            className="w-20 text-center text-sm h-7"
                          />
                          <span className="text-xs text-muted-foreground">{t("units.g")}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(item.calories * qty)} {t("units.kcal")} | {t("dashboard.proteinAbbr")}: {Math.round(item.protein * qty)}{t("units.g")} | {t("dashboard.carbsAbbr")}: {Math.round(item.carbs * qty)}{t("units.g")} | {t("dashboard.fatAbbr")}: {Math.round(item.fat * qty)}{t("units.g")}
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

          {todayHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("meals.todayHistory")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {todayHistory.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded border text-sm">
                    <span>{t(`mealTypes.${entry.mealType}`)}</span>
                    <span className="font-medium">{entry.totalCalories} {t("units.kcal")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

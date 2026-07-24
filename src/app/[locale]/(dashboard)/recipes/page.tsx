"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Clock, Users, ChefHat, Trash2, X, ChevronDown, ChevronUp, Edit } from "lucide-react";

interface Recipe {
  _id: string;
  name: string;
  nameAr?: string;
  category?: string;
  cookingMethod?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servingsCount?: number;
  difficulty?: string;
  nutritionPerServing?: { calories?: number; protein?: number; carbs?: number; fat?: number };
  instructions?: string[];
  instructionsAr?: string[];
  tips?: string[];
  tipsAr?: string[];
  cuisineStyle?: string;
}

const emptyForm = { name: "", nameAr: "", category: "breakfast", cookingMethod: "", prepTimeMinutes: 0, cookTimeMinutes: 0, servingsCount: 2, difficulty: "easy", nutritionPerServing: { calories: 0, protein: 0, carbs: 0, fat: 0 }, instructions: "", instructionsAr: "", tips: "", tipsAr: "" };

export default function RecipesPage() {
  const t = useTranslations();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRecipes = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    fetch(`/api/recipes?${params}`)
      .then((r) => r.json())
      .then((d) => setRecipes(d.recipes || []))
      .catch(console.error);
  };

  useEffect(() => { fetchRecipes(); }, [searchQuery, selectedCategory]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        instructions: form.instructions ? form.instructions.split("\n").filter((s: string) => s.trim()) : [],
        instructionsAr: form.instructionsAr ? form.instructionsAr.split("\n").filter((s: string) => s.trim()) : [],
        tips: form.tips ? form.tips.split("\n").filter((s: string) => s.trim()) : [],
        tipsAr: form.tipsAr ? form.tipsAr.split("\n").filter((s: string) => s.trim()) : [],
      };
      const url = editingId ? `/api/recipes?id=${editingId}` : "/api/recipes";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (editingId) {
          setRecipes(recipes.map((r) => r._id === editingId ? { ...r, ...data.recipe } : r));
        } else {
          setRecipes([data.recipe, ...recipes]);
        }
        setForm(emptyForm);
        setShowForm(false);
        setEditingId(null);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (recipe: Recipe) => {
    setForm({
      name: recipe.name,
      nameAr: recipe.nameAr || "",
      category: recipe.category || "breakfast",
      cookingMethod: recipe.cookingMethod || "",
      prepTimeMinutes: recipe.prepTimeMinutes || 0,
      cookTimeMinutes: recipe.cookTimeMinutes || 0,
      servingsCount: recipe.servingsCount || 2,
      difficulty: recipe.difficulty || "easy",
      nutritionPerServing: { calories: recipe.nutritionPerServing?.calories || 0, protein: recipe.nutritionPerServing?.protein || 0, carbs: recipe.nutritionPerServing?.carbs || 0, fat: recipe.nutritionPerServing?.fat || 0 },
      instructions: recipe.instructions?.join("\n") || "",
      instructionsAr: recipe.instructionsAr?.join("\n") || "",
      tips: recipe.tips?.join("\n") || "",
      tipsAr: recipe.tipsAr?.join("\n") || "",
    });
    setEditingId(recipe._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirm"))) return;
    const res = await fetch(`/api/recipes?id=${id}`, { method: "DELETE" });
    if (res.ok) setRecipes(recipes.filter((r) => r._id !== id));
  };

  const getDifficultyColor = (d?: string) => {
    switch (d) {
      case "easy": return "bg-primary/10 text-primary";
      case "medium": return "bg-muted text-muted-foreground";
      case "hard": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("recipes.recipes")}</h1>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? <X className="h-4 w-4 me-2" /> : <Plus className="h-4 w-4 me-2" />}
          {showForm ? t("common.cancel") : t("recipes.createRecipe")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t("recipes.editRecipe") : t("recipes.createRecipe")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>{t("food.foodName")}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                   <Label>{t("food.foodNameArabic")}</Label>
                  <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("recipes.category")}</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                    <option value="breakfast">{t("mealTypes.breakfast")}</option>
                    <option value="lunch">{t("mealTypes.lunch")}</option>
                    <option value="dinner">{t("mealTypes.dinner")}</option>
                    <option value="snack">{t("mealTypes.snack")}</option>
                    <option value="dessert">{t("recipes.dessert")}</option>
                    <option value="appetizer">{t("recipes.appetizer")}</option>
                    <option value="soup">{t("recipes.soup")}</option>
                    <option value="salad">{t("recipes.salad")}</option>
                    <option value="beverage">{t("recipes.beverage")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("recipes.difficulty")}</Label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                    <option value="easy">{t("recipes.easy")}</option>
                    <option value="medium">{t("recipes.medium")}</option>
                    <option value="hard">{t("recipes.hard")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("recipes.prepTime")}</Label>
                  <Input type="number" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("recipes.cookTime")}</Label>
                  <Input type="number" value={form.cookTimeMinutes} onChange={(e) => setForm({ ...form, cookTimeMinutes: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("recipes.servings")}</Label>
                  <Input type="number" value={form.servingsCount} onChange={(e) => setForm({ ...form, servingsCount: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("food.energy")} ({t("units.kcal")})</Label>
                  <Input type="number" value={form.nutritionPerServing?.calories || 0} onChange={(e) => setForm({ ...form, nutritionPerServing: { ...form.nutritionPerServing, calories: parseInt(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("food.protein")} ({t("units.g")})</Label>
                  <Input type="number" value={form.nutritionPerServing?.protein || 0} onChange={(e) => setForm({ ...form, nutritionPerServing: { ...form.nutritionPerServing, protein: parseInt(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("food.carbohydrates")} ({t("units.g")})</Label>
                  <Input type="number" value={form.nutritionPerServing?.carbs || 0} onChange={(e) => setForm({ ...form, nutritionPerServing: { ...form.nutritionPerServing, carbs: parseInt(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("food.totalFat")} ({t("units.g")})</Label>
                  <Input type="number" value={form.nutritionPerServing?.fat || 0} onChange={(e) => setForm({ ...form, nutritionPerServing: { ...form.nutritionPerServing, fat: parseInt(e.target.value) || 0 } })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("recipes.instructions")} ({t("food.foodNameArabic")})</Label>
                <textarea
                  value={form.instructionsAr}
                  onChange={(e) => setForm({ ...form, instructionsAr: e.target.value })}
                  placeholder={t("recipes.instructionsPlaceholder")}
                  className="w-full border rounded-md p-2 bg-background min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("recipes.instructions")} (English)</Label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  placeholder="One step per line..."
                  className="w-full border rounded-md p-2 bg-background min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("recipes.tips")} ({t("food.foodNameArabic")})</Label>
                <textarea
                  value={form.tipsAr}
                  onChange={(e) => setForm({ ...form, tipsAr: e.target.value })}
                  placeholder={t("recipes.tipsPlaceholder")}
                  className="w-full border rounded-md p-2 bg-background min-h-[60px]"
                />
              </div>
              <Button type="submit" disabled={saving}>{saving ? t("common.loading") : t("common.save")}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("recipes.searchRecipes")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ps-10" />
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="breakfast">{t("mealTypes.breakfast")}</TabsTrigger>
          <TabsTrigger value="lunch">{t("mealTypes.lunch")}</TabsTrigger>
          <TabsTrigger value="dinner">{t("mealTypes.dinner")}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <Card key={recipe._id} className="hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{recipe.nameAr || recipe.name}</h3>
                        <p className="text-sm text-muted-foreground">{recipe.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(recipe.difficulty)}>
                          {t(`recipes.${recipe.difficulty}`)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(recipe)} aria-label={t("recipes.editRecipe")}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe._id)} aria-label={t("recipes.deleteRecipe")}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} {t("recipes.minutes")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servingsCount || 1}</span>
                      </div>
                    </div>
                    {recipe.nutritionPerServing && (
                      <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        <div>
                          <div className="font-bold text-primary">{recipe.nutritionPerServing.calories || 0}</div>
                          <div className="text-muted-foreground">{t("units.kcal")}</div>
                        </div>
                        <div>
                          <div className="font-bold text-primary">{recipe.nutritionPerServing.protein || 0}{t("units.g")}</div>
                          <div className="text-muted-foreground">{t("dashboard.proteinAbbr")}</div>
                        </div>
                        <div>
                          <div className="font-bold text-muted-foreground">{recipe.nutritionPerServing.carbs || 0}{t("units.g")}</div>
                          <div className="text-muted-foreground">{t("dashboard.carbsAbbr")}</div>
                        </div>
                        <div>
                          <div className="font-bold text-accent">{recipe.nutritionPerServing.fat || 0}{t("units.g")}</div>
                          <div className="text-muted-foreground">{t("dashboard.fatAbbr")}</div>
                        </div>
                      </div>
                    )}
                    {(recipe.instructionsAr?.length || recipe.instructions?.length || recipe.tipsAr?.length) ? (
                      <div className="border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => setExpandedId(expandedId === recipe._id ? null : recipe._id)}
                        >
                          <span className="text-sm">{expandedId === recipe._id ? t("common.close") : t("recipes.steps")}</span>
                          {expandedId === recipe._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        {expandedId === recipe._id && (
                          <div className="mt-3 space-y-3 text-sm">
                            {recipe.instructionsAr && recipe.instructionsAr.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-1">{t("recipes.instructions")}</h4>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                  {recipe.instructionsAr.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                              </div>
                            )}
                            {recipe.instructions && recipe.instructions.length > 0 && !recipe.instructionsAr?.length && (
                              <div>
                                <h4 className="font-medium mb-1">{t("recipes.instructions")}</h4>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                  {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                              </div>
                            )}
                            {recipe.tipsAr && recipe.tipsAr.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-1">{t("recipes.tips")}</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  {recipe.tipsAr.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
            {recipes.length === 0 && (
              <div className="col-span-2 text-center text-muted-foreground py-8">
                {t("recipes.noRecipes")}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Clock, Users, ChefHat, Trash2, X } from "lucide-react";

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
}

const emptyForm = { name: "", nameAr: "", category: "main", cookingMethod: "", prepTimeMinutes: 0, cookTimeMinutes: 0, servingsCount: 2, difficulty: "easy" };

export default function RecipesPage() {
  const t = useTranslations();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes([data.recipe, ...recipes]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/recipes?id=${id}`, { method: "DELETE" });
    if (res.ok) setRecipes(recipes.filter((r) => r._id !== id));
  };

  const getDifficultyColor = (d?: string) => {
    switch (d) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("recipes.recipes")}</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4 me-2" /> : <Plus className="h-4 w-4 me-2" />}
          {showForm ? t("common.cancel") : t("recipes.createRecipe")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t("recipes.createRecipe")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.language") === "العربية" ? "الاسم بالعربي" : "Name (Arabic)"}</Label>
                  <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                    <option value="breakfast">{t("meals.breakfast")}</option>
                    <option value="main">{t("recipes.recipes")}</option>
                    <option value="side">{t("recipes.ingredients")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                    <option value="easy">{t("recipes.easy")}</option>
                    <option value="medium">{t("recipes.medium")}</option>
                    <option value="hard">{t("recipes.hard")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Prep (min)</Label>
                  <Input type="number" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Cook (min)</Label>
                  <Input type="number" value={form.cookTimeMinutes} onChange={(e) => setForm({ ...form, cookTimeMinutes: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Servings</Label>
                  <Input type="number" value={form.servingsCount} onChange={(e) => setForm({ ...form, servingsCount: parseInt(e.target.value) || 1 })} />
                </div>
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
          <TabsTrigger value="breakfast">{t("meals.breakfast")}</TabsTrigger>
          <TabsTrigger value="main">{t("recipes.recipes")}</TabsTrigger>
          <TabsTrigger value="side">{t("recipes.ingredients")}</TabsTrigger>
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
                          {recipe.difficulty}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(recipe._id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min</span>
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
                          <div className="text-muted-foreground">kcal</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-500">{recipe.nutritionPerServing.protein || 0}g</div>
                          <div className="text-muted-foreground">P</div>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-500">{recipe.nutritionPerServing.carbs || 0}g</div>
                          <div className="text-muted-foreground">C</div>
                        </div>
                        <div>
                          <div className="font-bold text-red-500">{recipe.nutritionPerServing.fat || 0}g</div>
                          <div className="text-muted-foreground">F</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {recipes.length === 0 && (
              <div className="col-span-2 text-center text-muted-foreground py-8">
                {t("recipes.noRecipes") || "No recipes yet. Create your first recipe!"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

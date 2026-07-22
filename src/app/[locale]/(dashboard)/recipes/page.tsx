"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Clock, Users, ChefHat } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  cookingMethod: string;
  cookingMethodAr: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isEgyptian: boolean;
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Koshari",
    nameAr: "كشري",
    category: "main",
    categoryAr: "أطباق رئيسية",
    cookingMethod: "boiled",
    cookingMethodAr: "مسلوق",
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: "medium",
    calories: 550,
    protein: 18,
    carbs: 85,
    fat: 15,
    isEgyptian: true,
  },
  {
    id: "2",
    name: "Ful Medames",
    nameAr: "فول مدمس",
    category: "breakfast",
    categoryAr: "إفطار",
    cookingMethod: "boiled",
    cookingMethodAr: "مسلوق",
    prepTime: 10,
    cookTime: 60,
    servings: 2,
    difficulty: "easy",
    calories: 350,
    protein: 20,
    carbs: 55,
    fat: 5,
    isEgyptian: true,
  },
  {
    id: "3",
    name: "Grilled Chicken",
    nameAr: "فراخ مشوية",
    category: "main",
    categoryAr: "أطباق رئيسية",
    cookingMethod: "grilled",
    cookingMethodAr: "مشوي",
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: "easy",
    calories: 330,
    protein: 45,
    carbs: 0,
    fat: 16,
    isEgyptian: true,
  },
  {
    id: "4",
    name: "Salad",
    nameAr: "سلطة خضراء",
    category: "side",
    categoryAr: "أطباق جانبية",
    cookingMethod: "raw",
    cookingMethodAr: "ني",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "easy",
    calories: 45,
    protein: 2,
    carbs: 8,
    fat: 1,
    isEgyptian: true,
  },
  {
    id: "5",
    name: "Pasta with Chicken",
    nameAr: "مكرونة بالفراخ",
    category: "main",
    categoryAr: "أطباق رئيسية",
    cookingMethod: "boiled",
    cookingMethodAr: "مسلوق",
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    difficulty: "easy",
    calories: 450,
    protein: 30,
    carbs: 55,
    fat: 12,
    isEgyptian: true,
  },
];

export default function RecipesPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.nameAr.includes(searchQuery) || 
                         recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return t("recipes.easy");
      case "medium": return t("recipes.medium");
      case "hard": return t("recipes.hard");
      default: return difficulty;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("recipes.recipes")}</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("recipes.createRecipe")}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("recipes.searchRecipes")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="breakfast">{t("meals.breakfast")}</TabsTrigger>
          <TabsTrigger value="main">{t("recipes.recipes")}</TabsTrigger>
          <TabsTrigger value="side">{t("recipes.ingredients")}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Egyptian Recipes Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{t("recipes.egyptianRecipes")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecipes
                .filter((r) => r.isEgyptian)
                .map((recipe) => (
                  <Card key={recipe.id} className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{recipe.nameAr}</h3>
                            <p className="text-sm text-muted-foreground">{recipe.name}</p>
                          </div>
                          <Badge className={getDifficultyColor(recipe.difficulty)}>
                            {getDifficultyText(recipe.difficulty)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.prepTime + recipe.cookTime} دقيقة</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings} حصص</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{recipe.cookingMethodAr}</Badge>
                          <Badge variant="secondary">{recipe.categoryAr}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                          <div>
                            <div className="font-bold text-primary">{recipe.calories}</div>
                            <div className="text-muted-foreground">سعرة</div>
                          </div>
                          <div>
                            <div className="font-bold text-blue-500">{recipe.protein}g</div>
                            <div className="text-muted-foreground">بروتين</div>
                          </div>
                          <div>
                            <div className="font-bold text-yellow-500">{recipe.carbs}g</div>
                            <div className="text-muted-foreground">كربوهيدرات</div>
                          </div>
                          <div>
                            <div className="font-bold text-red-500">{recipe.fat}g</div>
                            <div className="text-muted-foreground">دهون</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

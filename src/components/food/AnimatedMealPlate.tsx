"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Check } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  nameAr: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  color: string;
  icon: string;
}

interface PlateVisualizationProps {
  items: FoodItem[];
  maxCalories: number;
}

// Food icons (simplified SVG paths)
const foodIcons: Record<string, string> = {
  chicken: "M20,40 Q30,20 50,25 Q70,30 75,50 Q80,70 60,75 Q40,80 25,65 Q10,50 20,40",
  rice: "M15,45 Q25,35 45,30 Q65,25 80,40 Q90,55 75,65 Q55,75 35,70 Q15,65 15,45",
  salad: "M20,50 Q30,30 50,25 Q70,20 85,40 Q95,60 75,70 Q55,80 30,70 Q10,60 20,50",
  bread: "M10,40 Q20,25 40,20 Q60,15 80,25 Q95,35 90,55 Q85,75 60,80 Q35,85 15,70 Q5,55 10,40",
  egg: "M50,20 Q70,20 80,40 Q90,60 75,75 Q60,90 40,85 Q20,80 15,60 Q10,40 30,25 Q40,18 50,20",
  fruit: "M40,20 Q60,15 75,30 Q90,45 80,65 Q70,85 45,90 Q20,85 15,65 Q10,45 25,30 Q35,18 40,20",
};

// Plate position calculator
const calculatePlatePosition = (
  index: number, 
  total: number, 
  plateRadius: number = 80
) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = plateRadius * 0.6;
  const x = 100 + Math.cos(angle) * radius;
  const y = 100 + Math.sin(angle) * radius;
  return { x, y };
};

export default function AnimatedMealPlate({ 
  items = [], 
  maxCalories = 2000 
}: PlateVisualizationProps) {
  const t = useTranslations();
  const [animatedItems, setAnimatedItems] = useState<FoodItem[]>([]);
  
  // Animate items appearing
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedItems(items);
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  // Calculate totals
  const totals = animatedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate macro percentages
  const totalMacros = totals.protein + totals.carbs + totals.fat;
  const proteinPercent = totalMacros > 0 ? (totals.protein / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? (totals.carbs / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? (totals.fat / totalMacros) * 100 : 0;

  // Goal progress
  const calorieProgress = Math.min((totals.calories / maxCalories) * 100, 100);
  const isOverGoal = totals.calories > maxCalories;

  return (
    <div className="space-y-6">
      {/* Plate Visualization */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              {/* Plate background */}
              <circle cx="100" cy="100" r="90" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="2" />
              
              {/* Plate rim */}
              <circle cx="100" cy="100" r="85" fill="none" stroke="#DDD" strokeWidth="1" />
              
              {/* Goal progress ring */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke={isOverGoal ? "#EF4444" : "#10B981"}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 95}`}
                strokeDashoffset={`${2 * Math.PI * 95 * (1 - calorieProgress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              
              {/* Food items */}
              <AnimatePresence>
                {animatedItems.map((item, index) => {
                  const position = calculatePlatePosition(index, animatedItems.length);
                  const scale = Math.min(0.8, 0.4 + (item.calories / 500) * 0.4);
                  
                  return (
                    <motion.g
                      key={item.id}
                      initial={{ scale: 0, opacity: 0, x: 100, y: -50 }}
                      animate={{ 
                        scale: scale, 
                        opacity: 1, 
                        x: position.x - 40,
                        y: position.y - 30
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.1
                      }}
                    >
                      <path
                        d={foodIcons[item.icon] || foodIcons.chicken}
                        fill={item.color}
                        stroke={item.color}
                        strokeWidth="1"
                        transform="translate(40, 30)"
                      />
                      <text
                        x="50"
                        y="75"
                        textAnchor="middle"
                        fontSize="8"
                        fill="#666"
                        className="pointer-events-none"
                      >
                        {item.nameAr}
                      </text>
                    </motion.g>
                  );
                })}
              </AnimatePresence>
              
              {/* Empty plate message */}
              {animatedItems.length === 0 && (
                <motion.text
                  x="100"
                  y="100"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#999"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ابدأ بتسجيل وجبتك
                </motion.text>
              )}
            </svg>
          </div>
          
          {/* Calorie Progress */}
          <div className="text-center mt-4">
            <motion.div 
              className={`text-3xl font-bold ${isOverGoal ? "text-red-500" : "text-primary"}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {totals.calories}
            </motion.div>
            <div className="text-sm text-muted-foreground">
              / {maxCalories} {t("food.energy")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("meals.macroBalance")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Macro bars */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{t("meals.proteinLabel")}</span>
                <span className="font-medium">{totals.protein.toFixed(1)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${proteinPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{t("meals.carbsLabel")}</span>
                <span className="font-medium">{totals.carbs.toFixed(1)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${carbsPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{t("meals.fatLabel")}</span>
                <span className="font-medium">{totals.fat.toFixed(1)}g</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${fatPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
          
          {/* Macro percentages */}
          <div className="flex justify-around pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {proteinPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {t("meals.proteinLabel")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">
                {carbsPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {t("meals.carbsLabel")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">
                {fatPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {t("meals.fatLabel")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

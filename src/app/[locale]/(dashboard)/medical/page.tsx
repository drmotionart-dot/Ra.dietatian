"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Activity, 
  Droplets, 
  Shield, 
  AlertTriangle,
  ChevronRight,
  Info
} from "lucide-react";

interface NutrientInfo {
  name: string;
  nameAr: string;
  amount: string;
  unit: string;
  dailyValue: number;
  benefits: string[];
  benefitsAr: string[];
  considerations: string[];
  considerationsAr: string[];
}

interface FoodMedicalInfo {
  foodId: string;
  foodName: string;
  foodNameAr: string;
  category: string;
  categoryAr: string;
  nutrients: NutrientInfo[];
  pros: { text: string; textAr: string; category: string }[];
  cons: { text: string; textAr: string; category: string }[];
  disclaimer: string;
  disclaimerAr: string;
}

// Mock data for demonstration
const mockFoodMedicalInfo: FoodMedicalInfo = {
  foodId: "1",
  foodName: "Orange",
  foodNameAr: "برتقالة",
  category: "Fruits",
  categoryAr: "فواكه",
  nutrients: [
    {
      name: "Vitamin C",
      nameAr: "فيتامين سي",
      amount: "53.2",
      unit: "mg",
      dailyValue: 59,
      benefits: [
        "Powerful antioxidant that protects cells from damage",
        "Essential for collagen production and skin health",
        "Boosts immune system function",
        "Enhances iron absorption from plant foods"
      ],
      benefitsAr: [
        "مضاد أكسدة قوي يحمي الخلايا من التلف",
        "ضروري لإنتاج الكولاجين وصحة الجلد",
        "يعزز وظائف الجهاز المناعي",
        "يحسن امتصاص الحديد من الأطعمة النباتية"
      ],
      considerations: [
        "Excessive intake may cause digestive discomfort",
        "May interact with certain medications"
      ],
      considerationsAr: [
        "الإفراط في التناول قد يسبب انزعاجات الجهاز الهضمي",
        "قد يتفاعل مع بعض الأدوية"
      ]
    },
    {
      name: "Folate (Vitamin B9)",
      nameAr: "حمض الفوليك (فيتامين ب9)",
      amount: "30",
      unit: "mcg",
      dailyValue: 8,
      benefits: [
        "Essential for DNA synthesis and cell division",
        "Crucial during pregnancy for fetal development",
        "Helps prevent neural tube defects",
        "Supports red blood cell formation"
      ],
      benefitsAr: [
        "ضروري لاصطناع الحمض النووي وانقسام الخلايا",
        " חיוני أثناء الحمل لتطور الجنين",
        "يساعد في منع عيوب الأنبوب العصبي",
        "يدعم تكوين خلايا الدم الحمراء"
      ],
      considerations: [
        "Cooking can reduce folate content by up to 40%",
        "May mask vitamin B12 deficiency symptoms"
      ],
      considerationsAr: [
        "الطبخ قد يقلل محتوى حمض الفوليك بنسبة تصل إلى 40%",
        "قد يخفي أعراض نقص فيتامين ب12"
      ]
    },
    {
      name: "Potassium",
      nameAr: "البوتاسيوم",
      amount: "181",
      unit: "mg",
      dailyValue: 4,
      benefits: [
        "Helps regulate blood pressure",
        "Essential for proper muscle function",
        "Supports heart rhythm stability",
        "Aids in fluid balance regulation"
      ],
      benefitsAr: [
        "يساعد في تنظيم ضغط الدم",
        "ضروري لعملية العضلات السليمة",
        "يدعم استقرار نبضات القلب",
        "يساعد في تنظيم توازن السوائل"
      ],
      considerations: [
        "People with kidney disease should monitor potassium intake",
        "May interact with certain blood pressure medications"
      ],
      considerationsAr: [
        "يجب على مرضى الكلى مراقبة تناول البوتاسيوم",
        "قد يتفاعل مع بعض أدوية ضغط الدم"
      ]
    }
  ],
  pros: [
    { text: "Excellent source of Vitamin C", textAr: "مصدر ممتاز لفيتامين سي", category: "immune_support" },
    { text: "Low in calories", textAr: "قليل السعرات الحرارية", category: "weight_management" },
    { text: "High in antioxidants", textAr: "غني بمضادات الأكسدة", category: "heart_health" },
    { text: "Good for skin health", textAr: "جيد لصحة الجلد", category: "skin_health" },
    { text: "Supports immune system", textAr: "يدعم الجهاز المناعي", category: "immune_support" }
  ],
  cons: [
    { text: "High in natural sugars", textAr: "غني بالسكريات الطبيعية", category: "blood_sugar" },
    { text: "May cause allergic reactions in some people", textAr: "قد يسبب ردود فعل تحسسية لدى بعض الأشخاص", category: "allergy" },
    { text: "Acidic - may worsen acid reflux", textAr: "حمضي - قد يزيد من ارتجاع المعدة", category: "digestive_issue" }
  ],
  disclaimer: "This information is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making dietary changes.",
  disclaimerAr: "هذه المعلومات لأغراض تعليمية فقط ولا ت constitute نصيحة طبية. استشر دائماً طبيباً مؤهلاً قبل إجراء أي تغييرات في النظام الغذائي."
};

export default function MedicalPage() {
  const t = useTranslations();
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientInfo | null>(null);
  const foodInfo = mockFoodMedicalInfo;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "immune_support": return <Shield className="h-4 w-4" />;
      case "heart_health": return <Heart className="h-4 w-4" />;
      case "weight_management": return <Activity className="h-4 w-4" />;
      case "skin_health": return <Droplets className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("medical.medicalKnowledge")}</h1>
      </div>

      {/* Food Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{foodInfo.foodNameAr}</h2>
              <p className="text-muted-foreground">{foodInfo.foodName}</p>
              <Badge variant="secondary" className="mt-2">{foodInfo.categoryAr}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {foodInfo.disclaimerAr}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nutrients Tabs */}
      <Tabs defaultValue="nutrients">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nutrients">{t("medical.nutrientDetails")}</TabsTrigger>
          <TabsTrigger value="benefits">{t("medical.benefits")}</TabsTrigger>
          <TabsTrigger value="considerations">{t("medical.considerations")}</TabsTrigger>
        </TabsList>

        {/* Nutrients Tab */}
        <TabsContent value="nutrients" className="space-y-4">
          {foodInfo.nutrients.map((nutrient, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-colors ${
                selectedNutrient?.name === nutrient.name 
                  ? "border-primary" 
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => setSelectedNutrient(
                selectedNutrient?.name === nutrient.name ? null : nutrient
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{nutrient.nameAr}</h3>
                      <span className="text-sm text-muted-foreground">({nutrient.name})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-primary">
                        {nutrient.amount}{nutrient.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({nutrient.dailyValue}% {t("medical.dailyValue")})
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${
                    selectedNutrient?.name === nutrient.name ? "rotate-90" : ""
                  }`} />
                </div>

                {/* Expanded Content */}
                {selectedNutrient?.name === nutrient.name && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                        {t("medical.benefits")}
                      </h4>
                      <ul className="space-y-2">
                        {nutrient.benefitsAr.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-1">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">
                        {t("medical.considerations")}
                      </h4>
                      <ul className="space-y-2">
                        {nutrient.considerationsAr.map((consideration, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-500 mt-1">•</span>
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {foodInfo.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {getCategoryIcon(pro.category)}
                    </div>
                    <span>{pro.textAr}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Considerations Tab */}
        <TabsContent value="considerations" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {foodInfo.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>{con.textAr}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

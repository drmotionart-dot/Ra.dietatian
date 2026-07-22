"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Activity,
  Droplets,
  Shield,
  AlertTriangle,
  ChevronRight,
  Info,
  Search,
} from "lucide-react";

interface MedicalEntry {
  _id: string;
  foodId: string;
  foodCategory: string;
  micronutrients: { name: string; nameAr: string; amount: string; unit: string; dailyValue: number; benefitsAr: string[]; considerationsAr: string[] }[];
  vitamins: { name: string; nameAr: string; amount: string; unit: string; dailyValue: number; benefitsAr: string[]; considerationsAr: string[] }[];
  pros: { text: string; textAr: string; category: string }[];
  cons: { text: string; textAr: string; category: string }[];
  conditions: { name: string; nameAr: string; description: string; descriptionAr: string }[];
  disclaimerAr: string;
}

export default function MedicalPage() {
  const t = useTranslations();
  const [entries, setEntries] = useState<MedicalEntry[]>([]);
  const [selected, setSelected] = useState<MedicalEntry | null>(null);
  const [query, setQuery] = useState("");
  const [selectedNutrient, setSelectedNutrient] = useState<number | null>(null);

  useEffect(() => {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    fetch(`/api/medical${params}`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.knowledge || [];
        setEntries(list);
        if (!selected && list.length > 0) setSelected(list[0]);
      })
      .catch(console.error);
  }, [query]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "immune_support": return <Shield className="h-4 w-4" />;
      case "heart_health": return <Heart className="h-4 w-4" />;
      case "weight_management": return <Activity className="h-4 w-4" />;
      case "skin_health": return <Droplets className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const allNutrients = selected
    ? [...(selected.micronutrients || []), ...(selected.vitamins || [])]
    : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("medical.medicalKnowledge")}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("medical.searchFood")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ps-10"
            />
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {entries.map((entry) => (
                <Badge
                  key={entry._id}
                  variant={selected?._id === entry._id ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => { setSelected(entry); setSelectedNutrient(null); }}
                >
                  {entry.foodId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selected ? (
        <>
          <Card>
            <CardContent className="pt-6">
              <div>
                <h2 className="text-xl font-semibold">{selected.foodId}</h2>
                <Badge variant="secondary" className="mt-2">{selected.foodCategory}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {selected.disclaimerAr || t("medical.disclaimer")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="nutrients">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nutrients">{t("medical.nutrientDetails")}</TabsTrigger>
              <TabsTrigger value="benefits">{t("medical.benefits")}</TabsTrigger>
              <TabsTrigger value="considerations">{t("medical.considerations")}</TabsTrigger>
            </TabsList>

            <TabsContent value="nutrients" className="space-y-4">
              {allNutrients.map((nutrient, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-colors ${
                    selectedNutrient === index ? "border-primary" : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setSelectedNutrient(selectedNutrient === index ? null : index)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{nutrient.nameAr || nutrient.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-primary">
                            {nutrient.amount}{nutrient.unit}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({nutrient.dailyValue}% DV)
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-transform ${
                        selectedNutrient === index ? "rotate-90" : ""
                      }`} />
                    </div>
                    {selectedNutrient === index && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        {nutrient.benefitsAr && nutrient.benefitsAr.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">{t("medical.benefits")}</h4>
                            <ul className="space-y-2">
                              {nutrient.benefitsAr.map((b, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-green-500 mt-1">•</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {nutrient.considerationsAr && nutrient.considerationsAr.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">{t("medical.considerations")}</h4>
                            <ul className="space-y-2">
                              {nutrient.considerationsAr.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="text-orange-500 mt-1">•</span>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {(selected.pros || []).map((pro, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1">{getCategoryIcon(pro.category)}</div>
                        <span>{pro.textAr || pro.text}</span>
                      </li>
                    ))}
                    {(!selected.pros || selected.pros.length === 0) && (
                      <li className="text-muted-foreground">{t("medical.noBenefits")}</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="considerations" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {(selected.cons || []).map((con, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span>{con.textAr || con.text}</span>
                      </li>
                    ))}
                    {(!selected.cons || selected.cons.length === 0) && (
                      <li className="text-muted-foreground">{t("medical.noConsiderations")}</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-8">
            {entries.length === 0
              ? t("medical.noData")
              : t("medical.selectFood")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

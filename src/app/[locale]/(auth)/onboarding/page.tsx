"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ACTIVITY_LEVELS = [1.2, 1.375, 1.55, 1.725, 1.9];
const GOALS = ["maintain", "lose", "gain"] as const;

const DIETARY_OPTIONS = [
  "highProtein", "lowCarb", "vegetarian", "vegan", "keto", "halal",
  "egyptianCuisine", "mediterranean", "glutenFree", "dairyFree",
];

const INTEREST_OPTIONS = [
  "weightLoss", "muscleGain", "generalHealth", "ramadanFasting",
  "sportsPerformance", "bodybuilding", "endurance", "flexibility",
];

const EGYPTIAN_CITIES = [
  "Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Port Said",
  "Suez", "Mansoura", "Tanta", "Ismailia", "Zagazig", "Damanhur",
  "Minya", "Assiut", "Sohag", "Qena", "Hurghada", "Sharm El Sheikh",
];

export default function OnboardingPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    sex: "male" as string,
    dateOfBirth: "",
    heightCm: "",
    weightKg: "",
    activityLevel: 1.55,
    goal: "maintain" as string,
    targetWeightKg: "",
    dietaryPreferences: [] as string[],
    interests: [] as string[],
    fastingCity: "Cairo",
  });

  const totalSteps = 7;

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/" + locale + "/dashboard");
      } else {
        setError(data.error || t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const activityLabels = [
    t("onboarding.sedentary"),
    t("onboarding.lightlyActive"),
    t("onboarding.moderatelyActive"),
    t("onboarding.veryActive"),
    t("onboarding.extremelyActive"),
  ];

  const stepTitles: Record<number, string> = {
    1: t("onboarding.profileSetup"),
    2: t("onboarding.weight") + " & " + t("onboarding.height"),
    3: t("onboarding.activityLevel"),
    4: t("onboarding.goal"),
    5: t("onboarding.dietaryPreferences") || "Dietary Preferences",
    6: t("onboarding.interests") || "Interests",
    7: t("onboarding.location") || "Location",
  };

  const toggleArrayItem = (field: "dietaryPreferences" | "interests", value: string) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const validateStep = (s: number): boolean => {
    if (s === 1 && (!form.dateOfBirth || parseInt(form.dateOfBirth) < 10 || parseInt(form.dateOfBirth) > 120)) {
      setError(t("onboarding.age") + " (10-120)");
      return false;
    }
    if (s === 2 && (!form.heightCm || !form.weightKg)) {
      setError(t("onboarding.height") + " & " + t("onboarding.weight") + " required");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i < step ? "bg-primary w-6" : "bg-muted w-3"
                )}
              />
            ))}
          </div>
          <CardTitle className="text-xl">{stepTitles[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("onboarding.gender")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["male", "female"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={form.sex === s ? "default" : "outline"}
                      onClick={() => setForm({ ...form, sex: s })}
                      className="h-12"
                    >
                      {s === "male" ? t("onboarding.male") : t("onboarding.female")}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.age")}</Label>
                <Input
                  type="number"
                  min="10"
                  max="120"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  placeholder="25"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("onboarding.height")} (cm)</Label>
                <Input
                  type="number"
                  min="100"
                  max="250"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  placeholder="175"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.weight")} (kg)</Label>
                <Input
                  type="number"
                  min="30"
                  max="300"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  placeholder="70"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {ACTIVITY_LEVELS.map((level, i) => (
                <Button
                  key={level}
                  variant={form.activityLevel === level ? "default" : "outline"}
                  onClick={() => setForm({ ...form, activityLevel: level })}
                  className="w-full h-12 justify-start text-start"
                >
                  {activityLabels[i]}
                </Button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {GOALS.map((g) => (
                  <Button
                    key={g}
                    variant={form.goal === g ? "default" : "outline"}
                    onClick={() => setForm({ ...form, goal: g })}
                    className="h-12"
                  >
                    {t("onboarding." + (g === "maintain" ? "maintainWeight" : g === "lose" ? "loseWeight" : "gainWeight"))}
                  </Button>
                ))}
              </div>
              {form.goal !== "maintain" && (
                <div className="space-y-2">
                  <Label>{t("onboarding.targetWeight")} (kg)</Label>
                  <Input
                    type="number"
                    min="30"
                    max="300"
                    value={form.targetWeightKg}
                    onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                    placeholder={form.goal === "lose" ? "65" : "80"}
                  />
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("onboarding.dietaryHint") || "Select all that apply"}</p>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    variant={form.dietaryPreferences.includes(opt) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem("dietaryPreferences", opt)}
                    className="h-9"
                  >
                    {t("onboarding.diet." + opt) || opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("onboarding.interestsHint") || "What are you focused on?"}</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    variant={form.interests.includes(opt) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem("interests", opt)}
                    className="h-9"
                  >
                    {t("onboarding.interest." + opt) || opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3">
              <Label>{t("onboarding.city") || "City"}</Label>
              <select
                value={form.fastingCity}
                onChange={(e) => setForm({ ...form, fastingCity: e.target.value })}
                className="w-full border rounded-md p-2 bg-background"
              >
                {EGYPTIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {t("onboarding.cityHint") || "Used to set accurate fasting times"}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                {t("common.back")}
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={() => { if (validateStep(step)) setStep(step + 1); }} className="flex-1">
                {t("common.next")}
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading} className="flex-1">
                {loading ? t("common.loading") : t("onboarding.startTracking")}
              </Button>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive text-center mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

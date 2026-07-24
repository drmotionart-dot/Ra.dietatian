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

export default function OnboardingPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sex: "male" as string,
    dateOfBirth: "",
    heightCm: "",
    weightKg: "",
    activityLevel: 1.55,
    goal: "maintain" as string,
    targetWeightKg: "",
  });

  const totalSteps = 4;

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard`);
      }
    } catch {
      console.error("Onboarding failed");
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
                  i < step ? "bg-primary w-8" : "bg-muted w-4"
                )}
              />
            ))}
          </div>
          <CardTitle className="text-xl">
            {step === 1 && t("onboarding.profileSetup")}
            {step === 2 && t("onboarding.weight") + " & " + t("onboarding.height")}
            {step === 3 && t("onboarding.activityLevel")}
            {step === 4 && t("onboarding.goal")}
          </CardTitle>
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
                    {t(`onboarding.${g === "maintain" ? "maintainWeight" : g === "lose" ? "loseWeight" : "gainWeight"}`)}
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

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                {t("common.back")}
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                {t("common.next")}
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading} className="flex-1">
                {loading ? t("common.loading") : t("onboarding.startTracking")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

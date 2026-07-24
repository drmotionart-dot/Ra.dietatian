"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, User, Target, Download, Droplets, Moon } from "lucide-react";
import { PageSkeleton } from "@/components/ui/skeleton";

interface UserProfile {
  name: string;
  email: string;
  sex: string;
  heightCm: number;
  activityLevel: number;
  goal: string;
  targetWeightKg: number;
  units: string;
  locale: string;
  customCalorieTarget?: number;
  waterGoalMl?: number;
  fastingCity?: string;
  fastingCountry?: string;
  suhoorTime?: string;
  iftarTime?: string;
}

export default function SettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const isArabic = currentLocale === "ar";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", sex: "", heightCm: 0, activityLevel: 1.55, goal: "maintain", targetWeightKg: 0, units: "metric", customCalorieTarget: 0, waterGoalMl: 2500, fastingCity: "Cairo", fastingCountry: "Egypt", suhoorTime: "03:30", iftarTime: "19:00" });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile(d.user);
          setForm({
            name: d.user.name || "",
            sex: d.user.sex || "",
            heightCm: d.user.heightCm || 170,
            activityLevel: d.user.activityLevel || 1.55,
            goal: d.user.goal || "maintain",
            targetWeightKg: d.user.targetWeightKg || 0,
            units: d.user.units || "metric",
            customCalorieTarget: d.user.customCalorieTarget || 0,
            waterGoalMl: d.user.waterGoalMl || 2500,
            fastingCity: d.user.fastingCity || "Cairo",
            fastingCountry: d.user.fastingCountry || "Egypt",
            suhoorTime: d.user.suhoorTime || "03:30",
            iftarTime: d.user.iftarTime || "19:00",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleLanguage = () => {
    const newLocale = isArabic ? "en" : "ar";
    router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setEditing(false);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const [mealsRes, bodyRes, waterRes, workoutsRes] = await Promise.all([
        fetch("/api/meals?startDate=2020-01-01").then((r) => r.json()),
        fetch("/api/body-measurements").then((r) => r.json()),
        fetch("/api/water").then((r) => r.json()),
        fetch("/api/workouts?limit=500").then((r) => r.json()),
      ]);
      const exportData = {
        profile,
        meals: mealsRes.mealLogs || [],
        bodyMeasurements: bodyRes.measurements || [],
        waterLogs: waterRes.logs || [],
        workouts: workoutsRes.sessions || [],
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ra-diet-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("settings.settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{isArabic ? "العربية" : "English"}</p>
            </div>
            <Button variant="outline" onClick={toggleLanguage}>
              {isArabic ? "English" : "العربية"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("settings.profile")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && !editing && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.name")}</span><span>{profile.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.email")}</span><span>{profile.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.sex")}</span><span>{profile.sex ? t(`settings.${profile.sex}`) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.height")}</span><span>{profile.heightCm} {t("units.cm")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.goal")}</span><span>{t(`settings.${profile.goal === "lose" ? "loseWeight" : profile.goal === "gain" ? "gainWeight" : "maintain"}`)}</span></div>
            </div>
          )}

          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.name")}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.sex")}</Label>
                <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                  <option value="">—</option>
                  <option value="male">{t("settings.male")}</option>
                  <option value="female">{t("settings.female")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.height")} ({t("units.cm")})</Label>
                <Input type="number" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.goal")}</Label>
                <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full border rounded-md p-2 bg-background">
                  <option value="maintain">{t("settings.maintain")}</option>
                  <option value="lose">{t("settings.loseWeight")}</option>
                  <option value="gain">{t("settings.gainWeight")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.targetWeight")} ({t("units.kg")})</Label>
                <Input type="number" value={form.targetWeightKg} onChange={(e) => setForm({ ...form, targetWeightKg: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.activityLevel")}</Label>
                <select
                  value={form.activityLevel.toString()}
                  onChange={(e) => setForm({ ...form, activityLevel: parseFloat(e.target.value) })}
                  className="w-full border rounded-md p-2 bg-background"
                >
                  <option value="1.2">{t("settings.sedentary")}</option>
                  <option value="1.375">{t("settings.light")}</option>
                  <option value="1.55">{t("settings.moderate")}</option>
                  <option value="1.725">{t("settings.active")}</option>
                  <option value="1.9">{t("settings.veryActive")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.units")}</Label>
                <select
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                  className="w-full border rounded-md p-2 bg-background"
                >
                  <option value="metric">{t("settings.metric")}</option>
                  <option value="imperial">{t("settings.imperial")}</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>{saving ? t("common.loading") : t("common.save")}</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>{t("common.cancel")}</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>{t("settings.editProfile")}</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {t("settings.waterGoal")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-2">
              <Label>{t("settings.waterGoal")} ({t("units.ml")})</Label>
              <Input
                type="number"
                min="500"
                max="10000"
                step="250"
                value={form.waterGoalMl}
                onChange={(e) => setForm({ ...form, waterGoalMl: parseInt(e.target.value) || 2500 })}
              />
            </div>
          ) : (
            <p className="text-sm">{profile?.waterGoalMl || 2500} {t("units.ml")} / {t("common.day")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            {t("settings.fastingTimes")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>{t("settings.suhoorTime")}</Label>
                <Input
                  type="time"
                  value={form.suhoorTime}
                  onChange={(e) => setForm({ ...form, suhoorTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.iftarTime")}</Label>
                <Input
                  type="time"
                  value={form.iftarTime}
                  onChange={(e) => setForm({ ...form, iftarTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.fastingCity")}</Label>
                <Input
                  value={form.fastingCity}
                  onChange={(e) => setForm({ ...form, fastingCity: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="space-y-1 text-sm">
              <p>{t("settings.suhoorTime")}: {profile?.suhoorTime || "03:30"}</p>
              <p>{t("settings.iftarTime")}: {profile?.iftarTime || "19:00"}</p>
              <p>{t("settings.fastingCity")}: {profile?.fastingCity || "Cairo"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t("settings.exportData")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("settings.exportDataDesc")}</p>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4 me-2" />
            {exporting ? t("common.loading") : t("settings.exportData")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Moon, Sun, Ruler, User, Database } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  sex: string;
  heightCm: number;
  activityLevel: number;
  goal: string;
  targetWeightKg: number;
  units: string;
}

export default function SettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const isArabic = currentLocale === "ar";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", sex: "", heightCm: 0, activityLevel: 1.2, goal: "maintain", targetWeightKg: 0 });
  const [saving, setSaving] = useState(false);

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
            activityLevel: d.user.activityLevel || 1.2,
            goal: d.user.goal || "maintain",
            targetWeightKg: d.user.targetWeightKg || 0,
          });
        }
      })
      .catch(console.error);
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
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.sex")}</span><span>{profile.sex || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.height")}</span><span>{profile.heightCm} {t("units.cm")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("settings.goal")}</span><span>{profile.goal}</span></div>
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
    </div>
  );
}

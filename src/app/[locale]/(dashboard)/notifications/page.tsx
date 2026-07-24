"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  BellOff,
  Clock,
  UtensilsCrossed,
  Droplets,
  Dumbbell,
  Scale,
  Moon,
  Trophy,
  Ruler,
} from "lucide-react";

interface NotifPrefs {
  mealRemindersEnabled: boolean;
  waterRemindersEnabled: boolean;
  waterIntervalMinutes: number;
  exerciseRemindersEnabled: boolean;
  weightRemindersEnabled: boolean;
  weightFrequency: string;
  fastingRemindersEnabled: boolean;
  milestoneCelebrations: boolean;
  measurementRemindersEnabled: boolean;
  measurementFrequency: string;
}

const defaults: NotifPrefs = {
  mealRemindersEnabled: true,
  waterRemindersEnabled: true,
  waterIntervalMinutes: 60,
  exerciseRemindersEnabled: true,
  weightRemindersEnabled: true,
  weightFrequency: "weekly",
  fastingRemindersEnabled: true,
  milestoneCelebrations: true,
  measurementRemindersEnabled: true,
  measurementFrequency: "monthly",
};

export default function NotificationsPage() {
  const t = useTranslations();
  const [prefs, setPrefs] = useState<NotifPrefs>(defaults);
  const [saving, setSaving] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.preferences) {
          setPrefs({
            mealRemindersEnabled: d.preferences.mealRemindersEnabled ?? true,
            waterRemindersEnabled: d.preferences.waterRemindersEnabled ?? true,
            waterIntervalMinutes: d.preferences.waterIntervalMinutes ?? 60,
            exerciseRemindersEnabled: d.preferences.exerciseRemindersEnabled ?? true,
            weightRemindersEnabled: d.preferences.weightRemindersEnabled ?? true,
            weightFrequency: d.preferences.weightFrequency ?? "weekly",
            fastingRemindersEnabled: d.preferences.fastingRemindersEnabled ?? true,
            milestoneCelebrations: d.preferences.milestoneCelebrations ?? true,
            measurementRemindersEnabled: d.preferences.measurementRemindersEnabled ?? true,
            measurementFrequency: d.preferences.measurementFrequency ?? "monthly",
          });
        }
      })
      .catch(console.error);
  }, []);

  const toggle = (key: keyof NotifPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    persist(updated);
  };

  const persist = (data: NotifPrefs) => {
    setSaving(true);
    fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => setSaving(false))
      .catch(() => setSaving(false));
  };

  const enabledCount = [
    prefs.mealRemindersEnabled,
    prefs.waterRemindersEnabled,
    prefs.exerciseRemindersEnabled,
    prefs.weightRemindersEnabled,
    prefs.fastingRemindersEnabled,
    prefs.milestoneCelebrations,
    prefs.measurementRemindersEnabled,
  ].filter(Boolean).length;

  const toggleAll = (checked: boolean) => {
    const updated: NotifPrefs = {
      mealRemindersEnabled: checked,
      waterRemindersEnabled: checked,
      waterIntervalMinutes: prefs.waterIntervalMinutes,
      exerciseRemindersEnabled: checked,
      weightRemindersEnabled: checked,
      weightFrequency: prefs.weightFrequency,
      fastingRemindersEnabled: checked,
      milestoneCelebrations: checked,
      measurementRemindersEnabled: checked,
      measurementFrequency: prefs.measurementFrequency,
    };
    setPrefs(updated);
    persist(updated);
  };

  const settings = [
    { key: "mealRemindersEnabled" as const, icon: <UtensilsCrossed className="h-5 w-5" />, title: t("notifications.mealReminders"), time: t("notifications.timeMeals") },
    { key: "waterRemindersEnabled" as const, icon: <Droplets className="h-5 w-5" />, title: t("notifications.waterReminders"), time: t("notifications.waterInterval", { minutes: prefs.waterIntervalMinutes }) },
    { key: "exerciseRemindersEnabled" as const, icon: <Dumbbell className="h-5 w-5" />, title: t("notifications.exerciseReminders"), time: t("notifications.timeExercise") },
    { key: "weightRemindersEnabled" as const, icon: <Scale className="h-5 w-5" />, title: t("notifications.weightReminders"), time: t("notifications.weightWeekly") },
    { key: "fastingRemindersEnabled" as const, icon: <Moon className="h-5 w-5" />, title: t("notifications.fastingReminders") },
    { key: "milestoneCelebrations" as const, icon: <Trophy className="h-5 w-5" />, title: t("notifications.milestoneCelebrations") },
    { key: "measurementRemindersEnabled" as const, icon: <Ruler className="h-5 w-5" />, title: t("notifications.measurementReminders"), time: t("notifications.measurementMonthly") },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("notifications.notificationSettings")}</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {`${enabledCount} / ${settings.length}`}
        </span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {enabledCount > 0 ? <Bell className="h-6 w-6 text-primary" /> : <BellOff className="h-6 w-6 text-muted-foreground" />}
              <div>
                <p className="font-medium">{t("notifications.notifications")}</p>
                <p className="text-sm text-muted-foreground">{enabledCount > 0 ? t("notifications.enabled") : t("notifications.disabled")}</p>
              </div>
            </div>
            <Switch checked={enabledCount > 0} onCheckedChange={toggleAll} />
          </div>
        </CardContent>
      </Card>

      {"Notification" in window && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("notifications.permissionStatus")}</p>
                <p className="text-sm text-muted-foreground">
                  {permission === "granted" ? t("notifications.granted") : permission === "denied" ? t("notifications.denied") : t("notifications.default")}
                </p>
              </div>
              <Button
                variant={permission === "granted" ? "outline" : "default"}
                size="sm"
                disabled={permission === "denied"}
                onClick={async () => {
                  const p = await Notification.requestPermission();
                  setPermission(p);
                }}
              >
                {t("notifications.requestPermission")}
              </Button>
            </div>
            {permission === "granted" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  new Notification("FitTracker", { body: t("notifications.testSent"), icon: "/favicon.ico" });
                }}
              >
                {t("notifications.sendTest")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {settings.map((s) => (
          <Card key={s.key}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${prefs[s.key] ? "bg-primary/10" : "bg-muted"}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    {s.time && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{s.time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch checked={!!prefs[s.key]} onCheckedChange={() => toggle(s.key)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

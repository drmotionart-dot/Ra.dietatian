"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Clock, Calendar, TrendingUp } from "lucide-react";

interface FastingPrefs {
  ramadanEnabled: boolean;
  sunnahMondayThursday: boolean;
  sunnahAyyamAlBeed: boolean;
  sunnahSixDaysShawwal: boolean;
  city: string;
  suhoorTime?: string;
  iftarTime?: string;
}

interface FastingStats {
  totalDays: number;
  completedDays: number;
  streak: number;
}

interface FastingLogEntry {
  _id: string;
  date: string;
  fastingType: string;
  suhoorTime?: string;
  iftarTime?: string;
  completed: boolean;
}

const defaultPrefs: FastingPrefs = {
  ramadanEnabled: false,
  sunnahMondayThursday: false,
  sunnahAyyamAlBeed: false,
  sunnahSixDaysShawwal: false,
  city: "Cairo",
  suhoorTime: "03:30",
  iftarTime: "19:00",
};

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h, minutes: m };
}

function getFastingTimes(suhoorStr: string, iftarStr: string) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const { hours: suhoorH, minutes: suhoorM } = parseTime(suhoorStr);
  const { hours: iftarH, minutes: iftarM } = parseTime(iftarStr);
  const isFasting = (hours > suhoorH || (hours === suhoorH && minutes >= suhoorM)) &&
    (hours < iftarH || (hours === iftarH && minutes < iftarM));

  let fastingHours = 0, fastingMinutes = 0;
  if (isFasting) {
    const elapsed = (hours * 60 + minutes) - (suhoorH * 60 + suhoorM);
    fastingHours = Math.floor(elapsed / 60);
    fastingMinutes = elapsed % 60;
  }

  const targetTime = isFasting
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), iftarH, iftarM)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, suhoorH, suhoorM);
  const diff = targetTime.getTime() - now.getTime();
  const remainH = Math.floor(diff / 3600000);
  const remainM = Math.floor((diff % 3600000) / 60000);
  const nextMeal: "suhoor" | "iftar" = isFasting ? "iftar" : "suhoor";

  return { isFasting, fastingHours, fastingMinutes, remainH, remainM, nextMeal, suhoorTime: suhoorStr, iftarTime: iftarStr };
}

export default function FastingPage() {
  const t = useTranslations();
  const [prefs, setPrefs] = useState<FastingPrefs>(defaultPrefs);
  const [stats, setStats] = useState<FastingStats>({ totalDays: 0, completedDays: 0, streak: 0 });
  const [logs, setLogs] = useState<FastingLogEntry[]>([]);
  const [times, setTimes] = useState(getFastingTimes(defaultPrefs.suhoorTime!, defaultPrefs.iftarTime!));

  useEffect(() => {
    fetch("/api/fasting")
      .then((r) => r.json())
      .then((d) => {
        if (d.preferences) {
          setPrefs({
            ramadanEnabled: d.preferences.ramadanEnabled ?? false,
            sunnahMondayThursday: d.preferences.sunnahMondayThursday ?? false,
            sunnahAyyamAlBeed: d.preferences.sunnahAyyamAlBeed ?? false,
            sunnahSixDaysShawwal: d.preferences.sunnahSixDaysShawwal ?? false,
            city: d.preferences.city ?? "Cairo",
            suhoorTime: d.preferences.suhoorTime ?? "03:30",
            iftarTime: d.preferences.iftarTime ?? "19:00",
          });
          const suhoor = d.preferences.suhoorTime ?? "03:30";
          const iftar = d.preferences.iftarTime ?? "19:00";
          setTimes(getFastingTimes(suhoor, iftar));
        }
        if (d.stats) setStats(d.stats);
        if (d.logs) setLogs(d.logs);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimes(getFastingTimes(prefs.suhoorTime || "03:30", prefs.iftarTime || "19:00")), 60000);
    return () => clearInterval(interval);
  }, [prefs.suhoorTime, prefs.iftarTime]);

  const updatePref = (key: keyof FastingPrefs, value: boolean | string) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    fetch("/api/fasting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "preferences", ...updated }),
    }).catch(console.error);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Moon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("fasting.fastingMode")}</h1>
      </div>

      <Card className={times.isFasting ? "border-primary" : ""}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${times.isFasting ? "bg-primary" : "bg-muted"}`}
              animate={{ scale: times.isFasting ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {times.isFasting ? <Moon className="h-10 w-10 text-primary-foreground" /> : <Sun className="h-10 w-10 text-muted-foreground" />}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">
                {times.isFasting ? t("fasting.fasting") : t("fasting.eating")}
              </h2>
              <p className="text-muted-foreground">
                {times.isFasting
                  ? t("fasting.elapsed", { hours: times.fastingHours, minutes: times.fastingMinutes })
                  : `${t("fasting.nextMeal")}: ${times.nextMeal === "iftar" ? t("fasting.iftarTime") : t("fasting.suhoorTime")}`}
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">
              {String(times.remainH).padStart(2, "0")}:{String(times.remainM).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground">
              {times.nextMeal === "iftar" ? t("fasting.iftarTime") : t("fasting.suhoorTime")}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Clock className="h-6 w-6 mx-auto text-blue-500" />
              <Label className="text-xs text-muted-foreground">{t("fasting.suhoorTime")}</Label>
              <input
                type="time"
                value={prefs.suhoorTime || "03:30"}
                onChange={(e) => {
                  updatePref("suhoorTime", e.target.value);
                  setTimes(getFastingTimes(e.target.value, prefs.iftarTime || "19:00"));
                }}
                className="w-full text-center text-lg font-bold bg-transparent border rounded-md p-1"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Clock className="h-6 w-6 mx-auto text-orange-500" />
              <Label className="text-xs text-muted-foreground">{t("fasting.iftarTime")}</Label>
              <input
                type="time"
                value={prefs.iftarTime || "19:00"}
                onChange={(e) => {
                  updatePref("iftarTime", e.target.value);
                  setTimes(getFastingTimes(prefs.suhoorTime || "03:30", e.target.value));
                }}
                className="w-full text-center text-lg font-bold bg-transparent border rounded-md p-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("fasting.sunnahFasting")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("fasting.mondayThursday")}</Label>
              <p className="text-sm text-muted-foreground">{t("fasting.mondayThursdayDesc")}</p>
            </div>
            <Switch checked={prefs.sunnahMondayThursday} onCheckedChange={(c) => updatePref("sunnahMondayThursday", c)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("fasting.ayyamAlBeed")}</Label>
              <p className="text-sm text-muted-foreground">{t("fasting.ayyamAlBeedDesc")}</p>
            </div>
            <Switch checked={prefs.sunnahAyyamAlBeed} onCheckedChange={(c) => updatePref("sunnahAyyamAlBeed", c)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("fasting.sixDaysShawwal")}</Label>
              <p className="text-sm text-muted-foreground">{t("fasting.sixDaysShawwalDesc")}</p>
            </div>
            <Switch checked={prefs.sunnahSixDaysShawwal} onCheckedChange={(c) => updatePref("sunnahSixDaysShawwal", c)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("fasting.fastingStats")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">{t("fasting.currentStreak")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.totalDays}</div>
              <div className="text-xs text-muted-foreground">{t("fasting.totalDays")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.completedDays}</div>
              <div className="text-xs text-muted-foreground">{t("fasting.completed")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("fasting.logToday")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={async () => {
                await fetch("/api/fasting", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "log", fastingType: "ramadan", completed: true }),
                });
                const r = await fetch("/api/fasting");
                const d = await r.json();
                if (d.logs) setLogs(d.logs);
                if (d.stats) setStats(d.stats);
              }}
            >
              {t("fasting.logCompleted")}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={async () => {
                await fetch("/api/fasting", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "log", fastingType: "ramadan", completed: false }),
                });
                const r = await fetch("/api/fasting");
                const d = await r.json();
                if (d.logs) setLogs(d.logs);
                if (d.stats) setStats(d.stats);
              }}
            >
              {t("fasting.logMissed")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("fasting.history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("fasting.noHistory")}</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 14).map((log) => (
                <div key={log._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">
                    {new Date(log.date).toLocaleDateString("en-EG", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className={`text-sm font-medium ${log.completed ? "text-green-600" : "text-red-500"}`}>
                    {log.completed ? t("fasting.dayCompleted") : t("fasting.dayMissed")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t("fasting.disclaimer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

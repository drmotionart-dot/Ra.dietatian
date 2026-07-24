"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Trash2 } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { ProgressRing } from "@/components/ProgressRing";
import { PageTransition } from "@/components/PageTransition";

interface WaterLogEntry {
  _id: string;
  amountMl: number;
  note?: string;
  createdAt: string;
}

export default function WaterPage() {
  const t = useTranslations();
  const [logs, setLogs] = useState<WaterLogEntry[]>([]);
  const [totalMl, setTotalMl] = useState(0);
  const [goalMl, setGoalMl] = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWater();
  }, []);

  const fetchWater = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/water");
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalMl(data.totalMl || 0);
      if (data.goalMl) setGoalMl(data.goalMl);
    } catch (err) {
      console.error("Fetch water error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amountMl: number) => {
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountMl }),
      });
      if (res.ok) {
        const data = await res.json();
        setLogs([...logs, data.log]);
        setTotalMl(totalMl + amountMl);
      }
    } catch (err) {
      console.error("Add water error:", err);
    }
  };

  const addCustom = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount("");
    }
  };

  const deleteWater = async (id: string, amount: number) => {
    try {
      const res = await fetch(`/api/water?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(logs.filter((l) => l._id !== id));
        setTotalMl(totalMl - amount);
      }
    } catch (err) {
      console.error("Delete water error:", err);
    }
  };

  const progress = Math.min((totalMl / goalMl) * 100, 100);
  const glasses = Math.floor(totalMl / 250);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageTransition>
      <div className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("water.title")}</h1>
      </div>
      </PageTransition>

      <div className="space-y-6 stagger-enter">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <ProgressRing value={totalMl} max={goalMl} size={140} strokeWidth={10} color="var(--primary)">
              <div className="text-center">
                <CountUp to={totalMl} className="text-3xl font-bold text-primary" />
                <div className="text-[10px] text-muted-foreground">{t("units.ml")}</div>
              </div>
            </ProgressRing>
            <div className="text-sm text-muted-foreground">
              {t("water.of")} <CountUp to={goalMl} className="font-medium text-foreground" /> {t("units.ml")}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground w-full max-w-xs">
              <span>{glasses} {t("water.glasses")}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("water.quickAdd")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[250, 500, 750, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => addWater(amount)}
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">{amount}{t("units.ml")}</span>
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t("water.customPlaceholder")}
              className="flex-1 border rounded-md p-2 text-center"
            />
            <Button onClick={addCustom} disabled={!customAmount || parseInt(customAmount) <= 0}>
              {t("common.add")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("water.todayLog")}</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("water.noLogs")}</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">{log.amountMl} {t("units.ml")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteWater(log._id, log.amountMl)} aria-label={t("common.delete")}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

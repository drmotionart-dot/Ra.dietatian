"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Plus, TrendingUp } from "lucide-react";
import BodyVisualization from "@/components/body/BodyVisualization";

interface Measurement {
  _id: string;
  date: string;
  weightKg?: number;
  bodyFatPercent?: number;
  waistCm?: number;
  hipCm?: number;
  bicepCm?: number;
  chestCm?: number;
  thighCm?: number;
  neckCm?: number;
  bmi?: number;
  waistToHipRatio?: number;
}

export default function BodyPage() {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [userHeight, setUserHeight] = useState<number>(170);
  const [userSex, setUserSex] = useState<"male" | "female">("male");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weightKg: "",
    waistCm: "",
    hipCm: "",
    bicepCm: "",
    chestCm: "",
    thighCm: "",
    neckCm: "",
    bodyFatPercent: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/body-measurements").then((r) => r.json()),
      fetch("/api/dashboard").then((r) => r.json()),
    ])
      .then(([bmData, dashData]) => {
        setMeasurements(bmData.measurements || []);
        if (dashData.user?.heightCm) {
          setUserHeight(dashData.user.heightCm);
        }
        if (dashData.user?.sex) {
          setUserSex(dashData.user.sex as "male" | "female");
        }
      })
      .catch(console.error);
  }, []);

  const latest = measurements[0];

  const bodyMetrics = {
    weight: latest?.weightKg || 70,
    height: userHeight,
    bodyFatPercent: latest?.bodyFatPercent || 20,
    muscleMass: 30,
    waist: latest?.waistCm || 80,
    hip: latest?.hipCm || 95,
    bicep: latest?.bicepCm || 30,
    chest: latest?.chestCm || 100,
    thigh: latest?.thighCm || 50,
    neck: latest?.neckCm || 38,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      if (form.weightKg) body.weightKg = parseFloat(form.weightKg);
      if (form.waistCm) body.waistCm = parseFloat(form.waistCm);
      if (form.hipCm) body.hipCm = parseFloat(form.hipCm);
      if (form.bicepCm) body.bicepCm = parseFloat(form.bicepCm);
      if (form.chestCm) body.chestCm = parseFloat(form.chestCm);
      if (form.thighCm) body.thighCm = parseFloat(form.thighCm);
      if (form.neckCm) body.neckCm = parseFloat(form.neckCm);
      if (form.bodyFatPercent) body.bodyFatPercent = parseFloat(form.bodyFatPercent);

      const res = await fetch("/api/body-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.measurement) {
        setMeasurements([data.measurement, ...measurements]);
      }
      setForm({ weightKg: "", waistCm: "", hipCm: "", bicepCm: "", chestCm: "", thighCm: "", neckCm: "", bodyFatPercent: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("body.bodyMeasurements")}</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 me-2" />
          {t("body.addMeasurement")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              {t("body.addMeasurement")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">{t("body.weight")} (kg)</Label>
                  <Input id="weight" type="number" step="0.1" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} placeholder="70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">{t("body.bodyFat")} (%)</Label>
                  <Input id="bodyFat" type="number" step="0.1" value={form.bodyFatPercent} onChange={(e) => setForm({ ...form, bodyFatPercent: e.target.value })} placeholder="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">{t("body.waist")} (cm)</Label>
                  <Input id="waist" type="number" step="0.1" value={form.waistCm} onChange={(e) => setForm({ ...form, waistCm: e.target.value })} placeholder="80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hip">{t("body.hip")} (cm)</Label>
                  <Input id="hip" type="number" step="0.1" value={form.hipCm} onChange={(e) => setForm({ ...form, hipCm: e.target.value })} placeholder="95" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bicep">{t("body.bicep")} (cm)</Label>
                  <Input id="bicep" type="number" step="0.1" value={form.bicepCm} onChange={(e) => setForm({ ...form, bicepCm: e.target.value })} placeholder="32" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chest">{t("body.chest")} (cm)</Label>
                  <Input id="chest" type="number" step="0.1" value={form.chestCm} onChange={(e) => setForm({ ...form, chestCm: e.target.value })} placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thigh">{t("body.thigh")} (cm)</Label>
                  <Input id="thigh" type="number" step="0.1" value={form.thighCm} onChange={(e) => setForm({ ...form, thighCm: e.target.value })} placeholder="55" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neck">{t("body.neck")} (cm)</Label>
                  <Input id="neck" type="number" step="0.1" value={form.neckCm} onChange={(e) => setForm({ ...form, neckCm: e.target.value })} placeholder="38" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? t("common.loading") : t("common.save")}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("common.cancel")}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <BodyVisualization metrics={bodyMetrics} sex={userSex} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("body.measurementsHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {measurements.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t("body.noMeasurements")}</div>
          ) : (
            <div className="space-y-3">
              {measurements.map((m) => (
                <div key={m._id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{new Date(m.date).toLocaleDateString()}</div>
                    {m.bmi && <span className="text-sm text-muted-foreground">{t("body.bmiLabel")} {m.bmi}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    {m.weightKg && <div>{t("body.weightLabel")} {m.weightKg} {t("units.kg")}</div>}
                    {m.bodyFatPercent && <div>{t("body.fatLabel")} {m.bodyFatPercent}%</div>}
                    {m.waistCm && <div>{t("body.waistLabel")} {m.waistCm} {t("units.cm")}</div>}
                    {m.hipCm && <div>{t("body.hipLabel")} {m.hipCm} {t("units.cm")}</div>}
                    {m.chestCm && <div>{t("body.chestLabel")} {m.chestCm} {t("units.cm")}</div>}
                    {m.bicepCm && <div>{t("body.bicepLabel")} {m.bicepCm} {t("units.cm")}</div>}
                    {m.thighCm && <div>{t("body.thighLabel")} {m.thighCm} {t("units.cm")}</div>}
                    {m.neckCm && <div>{t("body.neckLabel")} {m.neckCm} {t("units.cm")}</div>}
                    {m.waistToHipRatio && <div>{t("body.waistToHipRatioLabel")} {m.waistToHipRatio}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

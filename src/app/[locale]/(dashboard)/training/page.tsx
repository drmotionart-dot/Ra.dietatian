"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, Dumbbell, TrendingUp, Clock, Flame } from "lucide-react";

interface Exercise {
  _id: string;
  name: string;
  nameAr?: string;
  category: string;
  muscleGroup: string;
  equipment?: string;
  isPreset?: boolean;
}

interface WorkoutSet {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  weightUnit?: string;
  rpe?: number;
  isWarmup?: boolean;
}

interface WorkoutSession {
  _id: string;
  name?: string;
  date: string;
  duration?: number;
  totalVolume?: number;
  totalSets?: number;
  totalReps?: number;
  feeling?: string;
  sets: WorkoutSet[];
}

export default function TrainingPage() {
  const t = useTranslations();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutFeeling, setWorkoutFeeling] = useState("good");
  const [isLogging, setIsLogging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalSessions: 0, totalVolume: 0, totalSets: 0 });

  useEffect(() => {
    fetch("/api/exercises?q=")
      .then((r) => r.json())
      .then((d) => setExercises(d.exercises || []))
      .catch(console.error);

    fetch("/api/workouts?limit=30")
      .then((r) => r.json())
      .then((d) => {
        setSessions(d.sessions || []);
        const allSessions = d.sessions || [];
        setStats({
          totalSessions: d.totalSessions || allSessions.length,
          totalVolume: allSessions.reduce((s: number, ws: WorkoutSession) => s + (ws.totalVolume || 0), 0),
          totalSets: allSessions.reduce((s: number, ws: WorkoutSession) => s + (ws.totalSets || 0), 0),
        });
      })
      .catch(console.error);
  }, []);

  const filteredExercises = exercises.filter((e) => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(q) || (e.nameAr && e.nameAr.includes(q));
  });

  const addExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setSearchQuery("");
  };

  const addSet = () => {
    if (!selectedExercise) return;
    const newSet: WorkoutSet = {
      exerciseId: selectedExercise._id,
      exerciseName: selectedExercise.nameAr || selectedExercise.name,
      setNumber: currentSets.filter((s) => s.exerciseId === selectedExercise._id).length + 1,
      reps: 0,
      weight: 0,
      weightUnit: "kg",
    };
    setCurrentSets([...currentSets, newSet]);
  };

  const updateSet = (index: number, field: keyof WorkoutSet, value: string | number | boolean) => {
    setCurrentSets(currentSets.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (currentSets.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workoutName || "Workout",
          feeling: workoutFeeling,
          sets: currentSets,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions([data.workout, ...sessions]);
        setCurrentSets([]);
        setSelectedExercise(null);
        setWorkoutName("");
        setIsLogging(false);
      }
    } catch (err) {
      console.error("Save workout error:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm(t("common.confirm"))) return;
    const res = await fetch(`/api/workouts?id=${id}`, { method: "DELETE" });
    if (res.ok) setSessions(sessions.filter((s) => s._id !== id));
  };

  const totalVolume = currentSets.reduce((sum, s) => sum + ((s.weight || 0) * (s.reps || 0)), 0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("training.title")}</h1>
        </div>
        <Button onClick={() => setIsLogging(!isLogging)}>
          {isLogging ? t("common.cancel") : <><Plus className="h-4 w-4 me-2" />{t("training.startWorkout")}</>}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
            <div className="text-xs text-muted-foreground">{t("training.totalWorkouts")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(stats.totalVolume).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{t("training.totalVolume")} (kg)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSets}</div>
            <div className="text-xs text-muted-foreground">{t("training.totalSets")}</div>
          </CardContent>
        </Card>
      </div>

      {isLogging && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              {t("training.activeWorkout")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("training.workoutName")}</Label>
                <Input value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder={t("training.workoutNamePlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label>{t("training.feeling")}</Label>
                <select value={workoutFeeling} onChange={(e) => setWorkoutFeeling(e.target.value)} className="w-full border rounded-md p-2 bg-background">
                  <option value="great">{t("training.feelingGreat")}</option>
                  <option value="good">{t("training.feelingGood")}</option>
                  <option value="okay">{t("training.feelingOkay")}</option>
                  <option value="bad">{t("training.feelingBad")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("training.addExercise")}</Label>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("training.searchExercise")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
              {searchQuery && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {filteredExercises.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground text-center">{t("training.noExercises")}</p>
                  ) : (
                    filteredExercises.slice(0, 10).map((ex) => (
                      <div
                        key={ex._id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-0"
                        onClick={() => { addExercise(ex); setSearchQuery(""); }}
                      >
                        <div>
                          <div className="font-medium">{ex.nameAr || ex.name}</div>
                          <div className="text-xs text-muted-foreground">{ex.muscleGroup} • {ex.equipment || "none"}</div>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedExercise && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{selectedExercise.nameAr || selectedExercise.name}</h3>
                  <Button size="sm" onClick={addSet}>
                    <Plus className="h-4 w-4 me-1" />{t("training.addSet")}
                  </Button>
                </div>
                {currentSets.filter((s) => s.exerciseId === selectedExercise._id).map((set) => {
                  const globalIndex = currentSets.indexOf(set);
                  return (
                    <div key={globalIndex} className="flex items-center gap-2 p-2 border rounded-lg">
                      <span className="text-sm font-medium w-8">{t("training.set")} {set.setNumber}</span>
                      <div className="flex-1 flex items-center gap-1">
                        <Label className="text-xs w-8">{t("training.weight")}</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={set.weight || ""}
                          onChange={(e) => updateSet(globalIndex, "weight", parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="text-xs text-muted-foreground">{t("units.kg")}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <Label className="text-xs w-8">{t("training.reps")}</Label>
                        <Input
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) => updateSet(globalIndex, "reps", parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <Label className="text-xs w-6">RPE</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={set.rpe || ""}
                          onChange={(e) => updateSet(globalIndex, "rpe", parseInt(e.target.value) || 0)}
                          className="w-14 text-center"
                        />
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeSet(globalIndex)} aria-label={t("common.delete")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {currentSets.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("training.totalSets")}: {currentSets.length}</span>
                  <span>{t("training.totalVolume")}: {totalVolume.toLocaleString()} kg</span>
                </div>
                <Button className="w-full" onClick={saveWorkout} disabled={saving}>
                  <Flame className="h-4 w-4 me-2" />
                  {saving ? t("common.loading") : t("training.saveWorkout")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("training.history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("training.noWorkouts")}</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session._id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{session.name || t("training.workout")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                        {session.duration ? ` • ${session.duration} ${t("training.minutes")}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{session.feeling || "good"}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => deleteSession(session._id)} aria-label={t("common.delete")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>{session.sets?.length || 0} {t("training.sets")}</div>
                    <div>{(session.totalReps || 0)} {t("training.reps")}</div>
                    <div>{(session.totalVolume || 0).toLocaleString()} kg</div>
                  </div>
                  {session.sets && session.sets.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {[...new Set(session.sets.map((s) => s.exerciseName))].join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

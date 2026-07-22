"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Clock, Calendar, TrendingUp } from "lucide-react";

interface FastingState {
  isRamadan: boolean;
  isSunnahFasting: boolean;
  suhoorTime: string;
  iftarTime: string;
  currentTime: Date;
  isFasting: boolean;
  fastingHours: number;
  fastingMinutes: number;
  nextMeal: "suhoor" | "iftar";
}

// Mock calculation - in real app, use hijri-utils and Aladhan API
const calculateFastingState = (): FastingState => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Simplified: assume suhoor at 3:30 AM, iftar at 7:00 PM
  const suhoorHour = 3;
  const suhoorMinute = 30;
  const iftarHour = 19;
  const iftarMinute = 0;
  
  let isFasting = false;
  let nextMeal: "suhoor" | "iftar" = "iftar";
  
  if (hours >= suhoorHour && hours < iftarHour) {
    isFasting = true;
    nextMeal = "iftar";
  } else {
    isFasting = false;
    nextMeal = "suhoor";
  }
  
  // Calculate fasting duration
  let fastingHours = 0;
  let fastingMinutes = 0;
  
  if (isFasting) {
    const startMinutes = suhoorHour * 60 + suhoorMinute;
    const currentMinutes = hours * 60 + minutes;
    const elapsed = currentMinutes - startMinutes;
    fastingHours = Math.floor(elapsed / 60);
    fastingMinutes = elapsed % 60;
  }
  
  return {
    isRamadan: true, // Mock - would check hijri calendar
    isSunnahFasting: false,
    suhoorTime: `${suhoorHour.toString().padStart(2, '0')}:${suhoorMinute.toString().padStart(2, '0')}`,
    iftarTime: `${iftarHour.toString().padStart(2, '0')}:${iftarMinute.toString().padStart(2, '0')}`,
    currentTime: now,
    isFasting,
    fastingHours,
    fastingMinutes,
    nextMeal,
  };
};

export default function FastingPage() {
  const t = useTranslations();
  const [fastingState, setFastingState] = useState<FastingState>(calculateFastingState());
  const [sunnahMonday, setSunnahMonday] = useState(false);
  const [sunnahAyyamAlBeed, setSunnahAyyamAlBeed] = useState(false);
  const [sunnahShawwal, setSunnahShawwal] = useState(false);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFastingState(calculateFastingState());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const now = new Date();
    const targetTime = fastingState.nextMeal === "iftar" 
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 3, 30);
    
    const diff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Moon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("fasting.fastingMode")}</h1>
      </div>

      {/* Fasting Status Card */}
      <Card className={fastingState.isFasting ? "border-primary" : ""}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                fastingState.isFasting ? "bg-primary" : "bg-muted"
              }`}
              animate={{
                scale: fastingState.isFasting ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {fastingState.isFasting ? (
                <Moon className="h-10 w-10 text-primary-foreground" />
              ) : (
                <Sun className="h-10 w-10 text-muted-foreground" />
              )}
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold">
                {fastingState.isFasting ? t("fasting.fasting") : t("fasting.eating")}
              </h2>
              <p className="text-muted-foreground">
                {fastingState.isFasting 
                  ? `منذ ${fastingState.fastingHours} ساعات و ${fastingState.fastingMinutes} دقائق`
                  : `${t("fasting.nextMeal")}: ${fastingState.nextMeal === "iftar" ? t("fasting.iftarTime") : t("fasting.suhoorTime")}`
                }
              </p>
            </div>
            
            {/* Countdown */}
            <div className="text-4xl font-bold text-primary">
              {timeRemaining.hours.toString().padStart(2, '0')}:
              {timeRemaining.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground">
              {fastingState.nextMeal === "iftar" ? t("fasting.iftarTime") : t("fasting.suhoorTime")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Times Card */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <div className="text-lg font-bold">{fastingState.suhoorTime}</div>
              <div className="text-sm text-muted-foreground">{t("fasting.suhoorTime")}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto text-orange-500 mb-2" />
              <div className="text-lg font-bold">{fastingState.iftarTime}</div>
              <div className="text-sm text-muted-foreground">{t("fasting.iftarTime")}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fasting Settings */}
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
              <p className="text-sm text-muted-foreground">الاثنين والخميس</p>
            </div>
            <Switch checked={sunnahMonday} onCheckedChange={setSunnahMonday} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("fasting.ayyamAlBeed")}</Label>
              <p className="text-sm text-muted-foreground">أيام البيض (13، 14، 15 من كل شهر هجري)</p>
            </div>
            <Switch checked={sunnahAyyamAlBeed} onCheckedChange={setSunnahAyyamAlBeed} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("fasting.sixDaysShawwal")}</Label>
              <p className="text-sm text-muted-foreground">ستة أيام من شهر شوال بعد عيد الفطر</p>
            </div>
            <Switch checked={sunnahShawwal} onCheckedChange={setSunnahShawwal} />
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
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
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">{t("fasting.currentStreak")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">30</div>
              <div className="text-xs text-muted-foreground">{t("fasting.totalDays")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">25</div>
              <div className="text-xs text-muted-foreground">{t("fasting.completed")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            الصيام during رمضان هو عبادة دينية. هذا التطبيق يتتبع صيامك لأغراض تعليمية فقط. 
            استشر طبيبك قبل الصيام، خاصة إذا كنت حاملًا أو مرضعًا أو مصابًا بأي حالة طبية.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

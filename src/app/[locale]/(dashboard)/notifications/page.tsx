"use client";

import { useState } from "react";
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
  Ruler
} from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  enabled: boolean;
  icon: React.ReactNode;
  time?: string;
}

export default function NotificationsPage() {
  const t = useTranslations();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "meal",
      title: "Meal Reminders",
      titleAr: "تذكير الوجبات",
      description: "Remind you to log your meals",
      descriptionAr: "تذكيرك بتسجيل وجباتك",
      enabled: true,
      icon: <UtensilsCrossed className="h-5 w-5" />,
      time: "08:00, 12:30, 19:00",
    },
    {
      id: "water",
      title: "Water Reminders",
      titleAr: "تذكير الماء",
      description: "Remind you to drink water",
      descriptionAr: "تذكيرك بشرب الماء",
      enabled: true,
      icon: <Droplets className="h-5 w-5" />,
      time: "كل ساعة",
    },
    {
      id: "exercise",
      title: "Exercise Reminders",
      titleAr: "تذكير التمارين",
      description: "Remind you to exercise",
      descriptionAr: "تذكيرك بالتمارين",
      enabled: true,
      icon: <Dumbbell className="h-5 w-5" />,
      time: "18:00",
    },
    {
      id: "weight",
      title: "Weight Reminders",
      titleAr: "تذكير الوزن",
      description: "Remind you to log your weight",
      descriptionAr: "تذكيرك بتسجيل وزنك",
      enabled: true,
      icon: <Scale className="h-5 w-5" />,
      time: "07:00 (أسبوعياً)",
    },
    {
      id: "fasting",
      title: "Fasting Reminders",
      titleAr: "تذكير الصيام",
      description: "Remind you of Suhoor and Iftar times",
      descriptionAr: "تذكيرك بمواعيد السحور والإفطار",
      enabled: true,
      icon: <Moon className="h-5 w-5" />,
      time: "قبل السحور والإفطار",
    },
    {
      id: "milestone",
      title: "Milestone Celebrations",
      titleAr: "احتفالات الإنجازات",
      description: "Celebrate when you reach milestones",
      descriptionAr: "احتفل عند تحقيق إنجازات",
      enabled: true,
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      id: "measurement",
      title: "Measurement Reminders",
      titleAr: "تذكير القياسات",
      description: "Remind you to take body measurements",
      descriptionAr: "تذكيرك بأخذ قياسات الجسم",
      enabled: true,
      icon: <Ruler className="h-5 w-5" />,
      time: "أول يوم في كل شهر",
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const enabledCount = settings.filter(s => s.enabled).length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("notifications.notificationSettings")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {enabledCount} من {settings.length} مفعّل
          </span>
        </div>
      </div>

      {/* All Notifications Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {enabledCount > 0 ? (
                <Bell className="h-6 w-6 text-primary" />
              ) : (
                <BellOff className="h-6 w-6 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">{t("notifications.notifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {enabledCount > 0 ? "الإشعارات مفعّلة" : "الإشعارات معطّلة"}
                </p>
              </div>
            </div>
            <Switch 
              checked={enabledCount > 0} 
              onCheckedChange={(checked) => {
                setSettings(settings.map(s => ({ ...s, enabled: checked })));
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings List */}
      <div className="space-y-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${setting.enabled ? "bg-primary/10" : "bg-muted"}`}>
                    {setting.icon}
                  </div>
                  <div>
                    <p className="font-medium">{setting.titleAr}</p>
                    <p className="text-sm text-muted-foreground">{setting.descriptionAr}</p>
                    {setting.time && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{setting.time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch 
                  checked={setting.enabled} 
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            {t("notifications.quietHours")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">ساعات الهدوء</p>
              <p className="text-sm text-muted-foreground">
                لا إشعارات بين 22:00 و 07:00
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Permission Status */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                إذن الإشعارات
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                لتفعيل الإشعارات، يرجى السماح بالإشعارات في إعدادات المتصفح
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

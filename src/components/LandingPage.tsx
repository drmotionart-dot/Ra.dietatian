"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MealsIcon } from "@/components/icons/MealsIcon";
import { TrainingIcon } from "@/components/icons/TrainingIcon";
import { AnalyticsIcon } from "@/components/icons/AnalyticsIcon";
import { WaterIcon } from "@/components/icons/WaterIcon";
import { RecipesIcon } from "@/components/icons/RecipesIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { PRIcon } from "@/components/icons/PRIcon";
import { StreakIcon } from "@/components/icons/StreakIcon";
import Link from "next/link";

export default function LandingPage() {
  const t = useTranslations("landing");
  const params = useParams();
  const locale = params.locale as string;

  const features = [
    { icon: <MealsIcon className="h-8 w-8" />, title: t("features.meals.title"), desc: t("features.meals.desc") },
    { icon: <TrainingIcon className="h-8 w-8" />, title: t("features.training.title"), desc: t("features.training.desc") },
    { icon: <ProfileIcon className="h-8 w-8" />, title: t("features.body.title"), desc: t("features.body.desc") },
    { icon: <AnalyticsIcon className="h-8 w-8" />, title: t("features.analytics.title"), desc: t("features.analytics.desc") },
    { icon: <WaterIcon className="h-8 w-8" />, title: t("features.water.title"), desc: t("features.water.desc") },
    { icon: <RecipesIcon className="h-8 w-8" />, title: t("features.recipes.title"), desc: t("features.recipes.desc") },
  ];

  const freeFeatures = [
    t("tierList.free.meals"),
    t("tierList.free.water"),
    t("tierList.free.fasting"),
    t("tierList.free.training"),
    t("tierList.free.body"),
    t("tierList.free.recipes"),
  ];

  const proFeatures = [
    t("tierList.pro.allFree"),
    t("tierList.pro.analytics"),
    t("tierList.pro.personalRecords"),
    t("tierList.pro.streaks"),
    t("tierList.pro.premiumThemes"),
    t("tierList.pro.notifications"),
    t("tierList.pro.export"),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-16 pb-24 text-center relative">
          <img
            src="/icons/icon-192.svg"
            alt="RAdiaeta"
            className="w-20 h-20 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-primary">RAdiaeta</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            {t("hero.tagline")}
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto mb-10">
            {t("hero.subline")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href={`/${locale}/login`}>
              <Button size="lg" variant="outline" className="px-8 ceramic-press">
                {t("hero.login")}
              </Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="lg" className="px-8 ceramic-press bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90">
                {t("hero.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">{t("features.heading")}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          {t("features.subheading")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-enter">
          {features.map((f, i) => (
            <Card key={i} className="ceramic ceramic-raised">
              <CardContent className="pt-6 space-y-3">
                <div className="text-primary">{f.icon}</div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Tier Comparison ── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">{t("tierList.heading")}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            {t("tierList.subheading")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free tier */}
            <Card className="ceramic ceramic-raised border-primary/20">
              <CardContent className="pt-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">RAdiaeta</h3>
                  <p className="text-sm text-muted-foreground">{t("tierList.free.label")}</p>
                </div>
                <ul className="space-y-3">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">&#10003;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/register`}>
                  <Button variant="outline" className="w-full ceramic-press">
                    {t("tierList.free.cta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium tier */}
            <Card className="ceramic ceramic-raised border-[var(--accent)]/30 bg-[var(--card)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)]" />
              <CardContent className="pt-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                    RAvictus <PRIcon className="h-5 w-5" />
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("tierList.pro.label")}</p>
                </div>
                <ul className="space-y-3">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/register`}>
                  <Button className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 ceramic-press gold-shimmer text-black font-bold">
                    {t("tierList.pro.cta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/icons/icon-192.svg" alt="" className="w-8 h-8" />
              <span className="font-bold text-lg">RAdiaeta</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href={`/${locale}/login`} className="hover:text-foreground transition-colors">{t("footer.login")}</Link>
              <Link href={`/${locale}/register`} className="hover:text-foreground transition-colors">{t("footer.signup")}</Link>
              <span className="cursor-default">{t("footer.privacy")}</span>
              <span className="cursor-default">{t("footer.terms")}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("footer.copy")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

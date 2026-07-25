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
import Link from "next/link";
import { useState } from "react";

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md mt-12">
      <div className="absolute -inset-6 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl border border-primary/10 bg-[var(--card)] ceramic-raised overflow-hidden">
        <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          <span className="ml-3 text-[10px] text-muted-foreground font-medium tracking-wide">RAdiaeta</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Today&apos;s Calories</p>
              <p className="text-2xl font-bold text-foreground">1,842 <span className="text-sm font-normal text-muted-foreground">/ 2,200</span></p>
            </div>
            <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0">
              <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(0.92 0.01 78)" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(0.55 0.15 35)" strokeWidth="6" strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset="38.2" transform="rotate(-90 40 40)" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Protein", value: "98g", color: "#6B1F2A", pct: 78 },
              { label: "Carbs", value: "210g", color: "#B8934A", pct: 84 },
              { label: "Fat", value: "62g", color: "#4B2E5A", pct: 73 },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-muted/40 p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden mb-1.5">
                  <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                </div>
                <p className="text-xs font-semibold">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {["Meals", "Training", "Water"].map((l) => (
              <div key={l} className="flex-1 rounded-lg bg-muted/40 py-2 text-center text-[10px] text-muted-foreground font-medium">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {q}
        <svg className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function LandingPage() {
  const t = useTranslations("landing");
  const params = useParams();
  const locale = params.locale as string;

  const steps = [
    { num: "1", title: t("howItWorks.step1.title"), desc: t("howItWorks.step1.desc") },
    { num: "2", title: t("howItWorks.step2.title"), desc: t("howItWorks.step2.desc") },
    { num: "3", title: t("howItWorks.step3.title"), desc: t("howItWorks.step3.desc") },
  ];

  const features = [
    { icon: <MealsIcon className="h-7 w-7" />, title: t("features.meals.title"), desc: t("features.meals.desc"), highlight: true },
    { icon: <AnalyticsIcon className="h-7 w-7" />, title: t("features.analytics.title"), desc: t("features.analytics.desc"), highlight: true },
    { icon: <TrainingIcon className="h-7 w-7" />, title: t("features.training.title"), desc: t("features.training.desc"), highlight: false },
    { icon: <ProfileIcon className="h-7 w-7" />, title: t("features.body.title"), desc: t("features.body.desc"), highlight: false },
    { icon: <WaterIcon className="h-7 w-7" />, title: t("features.water.title"), desc: t("features.water.desc"), highlight: false },
    { icon: <RecipesIcon className="h-7 w-7" />, title: t("features.recipes.title"), desc: t("features.recipes.desc"), highlight: false },
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

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-14 pb-8 text-center relative">
          <img
            src="/icons/icon-192.svg"
            alt="RAdiaeta"
            className="w-16 h-16 mx-auto mb-5"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            <span className="text-primary">RAdiaeta</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            {t("hero.tagline")}
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto mb-8">
            {t("hero.subline")}
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
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
          <p className="text-xs text-muted-foreground/60 mb-10">{t("hero.trust")}</p>

          <DashboardMockup />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t("howItWorks.heading")}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto text-sm">
          {t("howItWorks.subheading")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto stagger-enter">
          {steps.map((s, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto">
                {s.num}
              </div>
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t("features.heading")}</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto text-sm">
          {t("features.subheading")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-enter">
          {features.map((f, i) => (
            <Card
              key={i}
              className={`ceramic ceramic-raised border-border/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                f.highlight ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <CardContent className={`pt-5 space-y-2.5 ${f.highlight ? "pb-6" : ""}`}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Tier Comparison ── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t("tierList.heading")}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto text-sm">
            {t("tierList.subheading")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {/* Free tier */}
            <Card className="ceramic ceramic-raised border-primary/15 bg-[var(--card)]">
              <CardContent className="pt-6 space-y-5">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">RAdiaeta</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("tierList.free.label")}</p>
                </div>
                <ul className="space-y-3">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="text-primary mt-0.5 shrink-0">&#10003;</span>
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

            {/* Premium tier — dark espresso-gold theme */}
            <div className="rounded-xl ceramic-raised relative" style={{ backgroundColor: "#1D1712" }}>
              <div className="absolute inset-0 rounded-xl opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D9B978] via-[#F0E6D2] to-[#D9B978] rounded-t-xl" />
              <div className="pt-6 px-6 pb-6 space-y-5 relative">
                <div className="text-center">
                  <h3 className="text-2xl font-bold flex items-center justify-center gap-2" style={{ color: "#D9B978" }}>
                    RAvictus <PRIcon className="h-5 w-5" />
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "#F0E6D2", opacity: 0.5 }}>{t("tierList.pro.label")}</p>
                </div>
                <ul className="space-y-3">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#F0E6D2" }}>
                      <span className="mt-0.5 shrink-0" style={{ color: "#D9B978" }}>&#10003;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/register`}>
                  <Button className="w-full ceramic-press font-bold" style={{ backgroundColor: "#D9B978", color: "#1D1712" }}>
                    {t("tierList.pro.cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t("faq.heading")}</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-md mx-auto text-sm">
          {t("faq.subheading")}
        </p>
        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <img src="/icons/icon-192.svg" alt="" className="w-8 h-8" />
                <span className="font-bold text-lg">RAdiaeta</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t("footer.blurb")}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{t("footer.productLabel")}</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href={`/${locale}/register`} className="hover:text-foreground transition-colors">{t("footer.signup")}</Link>
                <Link href={`/${locale}/login`} className="hover:text-foreground transition-colors">{t("footer.login")}</Link>
                <span className="cursor-default">{t("footer.privacy")}</span>
                <span className="cursor-default">{t("footer.terms")}</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{t("footer.connectLabel")}</h4>
              <div className="flex gap-3">
                {["X", "IG", "FB"].map((s) => (
                  <span
                    key={s}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground cursor-default"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{t("footer.copy")}</p>
            <p className="text-xs text-muted-foreground/50">{t("footer.madeIn")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

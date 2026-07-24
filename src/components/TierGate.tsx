"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRIcon } from "@/components/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface TierGateProps {
  children: React.ReactNode;
  feature?: string;
}

export function TierGate({ children, feature }: TierGateProps) {
  const { data: session, update } = useSession();
  const t = useTranslations();
  const [upgrading, setUpgrading] = useState(false);
  const tier = session?.user?.tier;

  if (tier === "premium") {
    return <>{children}</>;
  }

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/user/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const fallback = await fetch("/api/user/upgrade", { method: "POST" });
        if (fallback.ok) {
          await update();
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <Card className="border-dashed border-primary/30">
      <CardContent className="pt-6 text-center space-y-4">
        <PRIcon className="h-10 w-10 mx-auto" />
        <div>
          <h3 className="font-bold text-lg">{t("tier.upgradeTitle") || "Unlock RAvictus"}</h3>
          <p className="text-sm text-muted-foreground">
            {feature
              ? (t("tier.featureLocked") || `"${feature}" is a premium feature`)
              : (t("tier.upgradeDescription") || "Upgrade to RAvictus for advanced analytics, premium themes, and more")}
          </p>
        </div>
        <Button onClick={handleUpgrade} disabled={upgrading} className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90">
          {upgrading ? t("common.loading") : (t("tier.upgradeNow") || "Upgrade to RAvictus")}
        </Button>
      </CardContent>
    </Card>
  );
}

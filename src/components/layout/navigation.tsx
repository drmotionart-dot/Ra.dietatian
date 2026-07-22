"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Moon, 
  Settings,
  BarChart3,
  Heart,
  Ruler,
  Bell
} from "lucide-react";

const navItems = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.meals", href: "/meals", icon: UtensilsCrossed },
  { key: "nav.body", href: "/body", icon: Ruler },
  { key: "nav.analytics", href: "/analytics", icon: BarChart3 },
  { key: "nav.fasting", href: "/fasting", icon: Moon },
];

const sidebarItems = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.meals", href: "/meals", icon: UtensilsCrossed },
  { key: "nav.recipes", href: "/recipes", icon: UtensilsCrossed },
  { key: "nav.body", href: "/body", icon: Ruler },
  { key: "nav.analytics", href: "/analytics", icon: BarChart3 },
  { key: "nav.fasting", href: "/fasting", icon: Moon },
  { key: "nav.medical", href: "/medical", icon: Heart },
  { key: "nav.notifications", href: "/notifications", icon: Bell },
];

export function MainNav() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-s bg-background">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <h1 className="text-xl font-bold">{t("common.appName")}</h1>
        </div>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.includes(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="px-2 space-y-1 border-t pt-4">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname.includes("/settings")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              {t("nav.settings")}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

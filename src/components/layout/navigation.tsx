"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/brand/LogoIcon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  HomeIcon,
  MealsIcon,
  TrainingIcon,
  AnalyticsIcon,
  ProfileIcon,
  WaterIcon,
  RecipesIcon,
  StreakIcon,
  SettingsIcon,
} from "@/components/icons";

function getLocaleFromPathname(pathname: string): string {
  const seg = pathname.split("/")[1];
  return seg === "ar" || seg === "en" ? seg : "en";
}

const navItems = [
  { key: "nav.dashboard", href: "/dashboard", Icon: HomeIcon },
  { key: "nav.meals", href: "/meals", Icon: MealsIcon },
  { key: "nav.training", href: "/training", Icon: TrainingIcon },
  { key: "nav.water", href: "/water", Icon: WaterIcon },
];

const sidebarItems = [
  { key: "nav.dashboard", href: "/dashboard", Icon: HomeIcon },
  { key: "nav.meals", href: "/meals", Icon: MealsIcon },
  { key: "nav.recipes", href: "/recipes", Icon: RecipesIcon },
  { key: "nav.body", href: "/body", Icon: ProfileIcon },
  { key: "nav.training", href: "/training", Icon: TrainingIcon },
  { key: "nav.water", href: "/water", Icon: WaterIcon },
  { key: "nav.analytics", href: "/analytics", Icon: AnalyticsIcon },
  { key: "nav.streak", href: "/dashboard", Icon: StreakIcon },
  { key: "nav.notifications", href: "/notifications", Icon: WaterIcon },
];

export function MainNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-sidebar/95 backdrop-blur-md border-t border-sidebar-border md:hidden z-50"
      aria-label={t("nav.mainNavigation")}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          const Icon = item.Icon;

          return (
            <Link
              key={item.href}
              href={"/" + locale + item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" activeColor={isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)"} />
              <span>{t(item.key)}</span>
              {isActive && (
                <span className="absolute -bottom-1 start-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sidebar-primary" />
              )}
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
  const locale = getLocaleFromPathname(pathname);

  return (
    <aside
      className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-s border-sidebar-border"
      aria-label={t("nav.sidebarNavigation")}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo header */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-sidebar-border">
          <LogoIcon size={28} />
          <span
            className="ms-2.5 text-lg font-bold text-sidebar-primary tracking-[2px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            RA
          </span>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-0.5" aria-label={t("nav.sidebarNavigation")}>
            {sidebarItems.map((item) => {
              const isActive = pathname.includes(item.href);
              const Icon = item.Icon;

              return (
                <Link
                  key={item.key}
                  href={"/" + locale + item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary border-s-2 border-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border-s-2 border-transparent"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" activeColor={isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)"} />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section: Settings + Theme toggle */}
          <div className="px-2 space-y-1 border-t border-sidebar-border pt-3">
            <Link
              href={`/${locale}/settings`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                pathname.includes("/settings")
                  ? "bg-sidebar-accent text-sidebar-primary border-s-2 border-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border-s-2 border-transparent"
              )}
              aria-current={pathname.includes("/settings") ? "page" : undefined}
            >
              <SettingsIcon className="h-5 w-5 shrink-0" activeColor={pathname.includes("/settings") ? "var(--sidebar-primary)" : "var(--sidebar-foreground)"} />
              {t("nav.settings")}
            </Link>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs text-sidebar-foreground/50">{t("settings.theme")}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

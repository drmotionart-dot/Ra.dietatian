import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/providers";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EBE2D0" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1712" },
  ],
};

export const metadata: Metadata = {
  title: "RA · Diaeta — Nutrition & Fitness",
  description: "Premium Egyptian nutrition tracking, body measurement, and wellness platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RA Diaeta",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "RA Diaeta",
  },
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={cairo.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="theme-color" content="#EBE2D0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1D1712" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-cairo antialiased">
        <Providers>
          <TooltipProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              {children}
            </NextIntlClientProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}

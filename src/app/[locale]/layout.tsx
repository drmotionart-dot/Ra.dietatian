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

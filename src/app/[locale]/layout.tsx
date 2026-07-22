import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/providers";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "FitTracker - Nutrition & Fitness Tracking",
  description: "Track your nutrition, body measurements, and reach your fitness goals",
  manifest: "/manifest.json",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
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
    <html lang={locale} dir={dir} className={cairo.variable}>
      <body className="font-cairo antialiased">
        <Providers>
          <TooltipProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}

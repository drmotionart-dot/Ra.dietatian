"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TierProvider } from "@/components/TierProvider";

function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // Check for SW updates every visit
      reg.update().catch(() => {});

      // If a new SW is waiting, activate it immediately
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New SW installed but old one still controlling — force activate
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch((err) => {
      console.error("SW registration failed:", err);
    });

    // Listen for SW messages (e.g. SKIP_WAITING confirmation)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // SW was replaced — page now served by new SW
    });
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <TierProvider>
          <ServiceWorkerRegistration />
          {children}
        </TierProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

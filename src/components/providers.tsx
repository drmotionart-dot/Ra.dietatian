"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TierProvider } from "@/components/TierProvider";

function ClearBrokenServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister());
    });
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <TierProvider>
          <ClearBrokenServiceWorker />
          {children}
        </TierProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const tier = session?.user?.tier;
    document.documentElement.setAttribute("data-tier", tier || "free");
  }, [session]);

  return <>{children}</>;
}

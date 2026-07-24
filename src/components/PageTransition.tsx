"use client";

import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("page-enter");
    const cleanup = () => el.classList.remove("page-enter");
    const timeout = setTimeout(cleanup, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={ref} className="page-transition">
      {children}
    </div>
  );
}

"use client";

interface LogoProps {
  variant?: "free" | "premium";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = { sm: 40, md: 56, lg: 72 };

export function Logo({ variant = "free", size = "md", showText = true, className }: LogoProps) {
  const s = sizes[size];
  const isPremium = variant === "premium";

  return (
    <div className={`flex flex-col items-center gap-1 ${className ?? ""}`}>
      <svg width={s} height={s} viewBox="0 0 72 72" aria-hidden="true">
        {isPremium ? (
          <>
            <circle cx="36" cy="36" r="33" fill="none" stroke="var(--chart-1)" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.6" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="var(--chart-1)" strokeWidth="1.2" />
          </>
        ) : (
          <circle cx="36" cy="36" r="32" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.2" opacity="0.5" />
        )}
        {/* Laurel branches */}
        <g stroke={isPremium ? "var(--chart-1)" : "var(--muted-foreground)"} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity={isPremium ? 1 : 0.6}>
          <path d="M18 44 C22 32 28 26 34 24" />
          <path d="M18 44 C21 36 22 30 24 26" />
          <path d="M54 44 C50 32 44 26 38 24" />
          <path d="M54 44 C51 36 50 30 48 26" />
        </g>
        {/* Sun disk */}
        <circle cx="36" cy="34" r={isPremium ? 9.5 : 9} fill={isPremium ? "var(--chart-1)" : "var(--primary)"} />
        {/* Sun rays */}
        <g stroke={isPremium ? "var(--chart-1)" : "var(--primary)"} strokeWidth={isPremium ? 1.4 : 1.3} strokeLinecap="round">
          <line x1="36" y1={isPremium ? 18 : 19} x2="36" y2={isPremium ? 13 : 14} />
          <line x1={isPremium ? 48 : 47.5} y1={isPremium ? 22 : 22.5} x2={isPremium ? 51.5 : 51} y2={isPremium ? 18 : 18.5} />
          <line x1={isPremium ? 24 : 24.5} y1={isPremium ? 22 : 22.5} x2={isPremium ? 20.5 : 21} y2={isPremium ? 18 : 18.5} />
          <line x1={isPremium ? 51.5 : 51} y1="34" x2={isPremium ? 57 : 56} y2="34" />
          <line x1={isPremium ? 20.5 : 21} y1="34" x2={isPremium ? 15 : 16} y2="34" />
          {isPremium && (
            <>
              <line x1="48" y1="46" x2="51.5" y2="50" />
              <line x1="24" y1="46" x2="20.5" y2="50" />
            </>
          )}
        </g>
        {/* Burgundy seal */}
        <circle
          cx="36"
          cy="48"
          r={isPremium ? 2.8 : 2.6}
          fill="var(--accent)"
          stroke={isPremium ? "var(--chart-1)" : "none"}
          strokeWidth={isPremium ? 0.6 : 0}
        />
      </svg>
      {showText && (
        <div className="text-center">
          <div
            className="tracking-[1.5px] font-bold"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {isPremium ? "RAvictus" : "RAdiaeta"}
          </div>
          <div className="text-[9px] tracking-[2px] text-muted-foreground mt-0.5 uppercase">
            {isPremium ? "Sustained Vitality" : "Daily Regimen"}
          </div>
        </div>
      )}
    </div>
  );
}

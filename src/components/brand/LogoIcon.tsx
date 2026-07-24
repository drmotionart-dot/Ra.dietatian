"use client";

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 32, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      aria-hidden="true"
      className={className}
    >
      <g stroke="var(--sidebar-foreground)" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M18 44 C22 32 28 26 34 24" />
        <path d="M18 44 C21 36 22 30 24 26" />
        <path d="M54 44 C50 32 44 26 38 24" />
        <path d="M54 44 C51 36 50 30 48 26" />
      </g>
      <circle cx="36" cy="34" r="9" fill="var(--sidebar-primary)" />
      <g stroke="var(--sidebar-primary)" strokeWidth="1.3" strokeLinecap="round">
        <line x1="36" y1="19" x2="36" y2="14" />
        <line x1="47.5" y1="22.5" x2="51" y2="18.5" />
        <line x1="24.5" y1="22.5" x2="21" y2="18.5" />
        <line x1="51" y1="34" x2="56" y2="34" />
        <line x1="21" y1="34" x2="16" y2="34" />
      </g>
      <circle cx="36" cy="48" r="2.6" fill="var(--accent)" />
    </svg>
  );
}

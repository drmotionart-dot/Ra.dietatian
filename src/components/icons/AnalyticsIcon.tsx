interface IconProps {
  className?: string;
  activeColor?: string;
}

export function AnalyticsIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 20h18" />
      <rect x="4" y="13" width="3" height="7" rx="0.5" />
      <rect x="10.5" y="9" width="3" height="11" rx="0.5" />
      <rect x="17" y="5" width="3" height="15" rx="0.5" />
      <path d="M5 5l4 3.5 3.5-2L18 4" />
    </svg>
  );
}

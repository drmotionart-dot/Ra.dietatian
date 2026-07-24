interface IconProps {
  className?: string;
  activeColor?: string;
}

export function ProfileIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M16 4.5c1.5 0 3 1 3 3" />
    </svg>
  );
}

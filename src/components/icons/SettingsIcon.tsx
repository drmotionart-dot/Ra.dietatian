interface IconProps {
  className?: string;
  activeColor?: string;
}

export function SettingsIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.9 4.9l2.1 2.1" />
      <path d="M16.9 16.9l2.1 2.1" />
      <path d="M4.9 19.1l2.1-2.1" />
      <path d="M16.9 7.1l2.1-2.1" />
    </svg>
  );
}

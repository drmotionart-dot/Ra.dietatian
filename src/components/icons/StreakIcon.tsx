interface IconProps {
  className?: string;
  activeColor?: string;
}

export function StreakIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2c-1 4-4 6-4 10a4 4 0 008 0c0-4-3-6-4-10z" />
      <path d="M12 22c3 0 5-2 5-5 0-3-2-5-5-8-3 3-5 5-5 8 0 3 2 5 5 5z" />
      <path d="M12 22c1.5 0 2.5-1 2.5-2.5 0-1.5-1-2.5-2.5-4-1.5 1.5-2.5 2.5-2.5 4 0 1.5 1 2.5 2.5 2.5z" />
    </svg>
  );
}

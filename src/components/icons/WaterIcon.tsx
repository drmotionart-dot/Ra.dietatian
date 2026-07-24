interface IconProps {
  className?: string;
  activeColor?: string;
}

export function WaterIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3c-2.5 4-6 7-6 11a6 6 0 0012 0c0-4-3.5-7-6-11z" />
      <path d="M10 14.5c0 1.5 1 2.5 2 2.5s2-1 2-2.5" />
    </svg>
  );
}

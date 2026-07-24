interface IconProps {
  className?: string;
  activeColor?: string;
}

export function TrainingIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6.5 6.5v11" />
      <path d="M17.5 6.5v11" />
      <path d="M6.5 12h11" />
      <path d="M4 8v8" />
      <path d="M20 8v8" />
      <path d="M2 9.5v5" />
      <path d="M22 9.5v5" />
    </svg>
  );
}

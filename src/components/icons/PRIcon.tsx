interface IconProps {
  className?: string;
  activeColor?: string;
}

export function PRIcon({ className, activeColor = "var(--accent)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2l2.5 5.5L20 9l-4 4 1 5.5L12 16l-5 2.5 1-5.5-4-4 5.5-1.5z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

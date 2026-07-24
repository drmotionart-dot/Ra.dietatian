interface IconProps {
  className?: string;
  activeColor?: string;
}

export function RecipesIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19V5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

interface IconProps {
  className?: string;
  activeColor?: string;
}

export function MealsIcon({ className, activeColor = "var(--sidebar-primary)" }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3C7 3 3 6 3 10c0 2.5 1.5 4.5 3.5 5.5V21h11v-5.5c2-1 3.5-3 3.5-5.5 0-4-4-7-9-7z" />
      <path d="M8 21v-5.5" />
      <path d="M16 21v-5.5" />
      <path d="M12 7v4" />
      <path d="M10 9h4" />
    </svg>
  );
}

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.75" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} className={className} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.2s-7.4-4.6-9.9-9.4C.6 7.6 2.2 4.3 5.6 3.6c2-.4 3.9.4 5 2 1.1-1.6 3-2.4 5-2 3.4.7 5 4 3.5 7.2-2.5 4.8-9.1 9.4-9.1 9.4z" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.4-4.4" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ChevronIcon({ className, direction = "right" }: IconProps & { direction?: "right" | "left" | "down" }) {
  const rotate = direction === "left" ? "rotate-180" : direction === "down" ? "rotate-90" : "";
  return (
    <svg {...base} className={`${className ?? ""} ${rotate}`}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function BallIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l3.6 2.6-1.4 4.3H9.8L8.4 9.6z" />
      <path d="M12 3v4M12 17v4M4.5 8.5l3.6 1.4M15.9 14.1l3.6 1.4M4.5 15.5l3.9-1.5M15.6 9.9l3.9-1.5" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />
    </svg>
  );
}

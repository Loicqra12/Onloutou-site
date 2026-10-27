export function NeedIcon({ id }: { id: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  } as const;

  switch (id) {
    case "vehicule":
      return (
        <svg {...common}>
          <path d="M4 14h16v4H4zM6 14l2-5h8l2 5M7 18v2M17 18v2" />
        </svg>
      );
    case "moto":
      return (
        <svg {...common}>
          <circle cx="6.5" cy="16.5" r="2.5" />
          <circle cx="17.5" cy="16.5" r="2.5" />
          <path d="M9 16.5h4l3-6H9.5L8 14" />
        </svg>
      );
    case "camion":
      return (
        <svg {...common}>
          <path d="M3 15h11V8H3zM14 11h4l3 4v2h-7zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      );
    case "materiel":
      return (
        <svg {...common}>
          <path d="M14 7h6l-2 4h-4zM4 17h7v3H4zM8 7v7" />
        </svg>
      );
    case "connecte":
      return (
        <svg {...common}>
          <path d="M5 12a7 7 0 0 1 14 0M8 12a4 4 0 0 1 8 0" />
          <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8v4l2.5 1.5" />
        </svg>
      );
  }
}

export function EngagementIcon({ id }: { id: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  } as const;

  if (id === "organisation") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="1.5" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }
  if (id === "conditions") {
    return (
      <svg {...common}>
        <path d="M7 4h10v16H7zM10 8h4M10 12h4M10 16h2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 16h16v3H4zM7 16V9l5-4 5 4v7" />
    </svg>
  );
}

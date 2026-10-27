export function ObjectiveIcon({ index }: { index: number }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  } as const;

  switch (index) {
    case 0:
      return (
        <svg {...common}>
          <path d="M4 14h16v4H4zM6 14l2-5h8l2 5" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M6 7h12l-1 12H7zM9 7V5h6v2" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M12 20s6-5.2 6-9a6 6 0 1 0-12 0c0 3.8 6 9 6 9z" />
          <circle cx="12" cy="11" r="1.6" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="12" rx="1.5" />
          <path d="M8 19h8" />
        </svg>
      );
  }
}

const common = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true,
} as const;

export function PlatformIcon({ name }: { name: string }) {
  switch (name) {
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14.4 16 15 19" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M16.2 14.6c2 .4 3.4 1.7 3.8 4.4" />
        </svg>
      );
    case "ops":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="1.5" />
          <path d="M8 9h8M8 12h6M8 15h4" />
        </svg>
      );
    case "partner":
      return (
        <svg {...common}>
          <circle cx="8" cy="9" r="2.4" />
          <circle cx="16" cy="9" r="2.4" />
          <path d="M4.5 18c.5-2.6 2.2-4 4.5-4s4 1.4 4.5 4M15 14c2.2 0 3.8 1.3 4.4 4" />
        </svg>
      );
    case "field":
      return (
        <svg {...common}>
          <path d="M4 16h16l-2-7H6z" />
          <circle cx="8" cy="18.5" r="1.5" />
          <circle cx="16" cy="18.5" r="1.5" />
        </svg>
      );
    case "access":
      return (
        <svg {...common}>
          <rect x="7" y="11" width="10" height="8" rx="1.2" />
          <path d="M9 11V8a3 3 0 0 1 6 0v3" />
        </svg>
      );
    case "docs":
      return (
        <svg {...common}>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v4h4M9 13h6M9 16h4" />
        </svg>
      );
    case "data":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="7" rx="6" ry="2.4" />
          <path d="M6 7v5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7M6 12v5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-5" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6" />
        </svg>
      );
    case "screen":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="11" rx="1.4" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case "plug":
      return (
        <svg {...common}>
          <path d="M9 4v5M15 4v5M7 9h10v3a5 5 0 0 1-10 0zM12 17v3" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M7 17h10a4 4 0 0 0 .3-8 5 5 0 0 0-9.6-1.4A3.6 3.6 0 0 0 7 17z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19c.8-3.2 3.4-5 7-5s6.2 1.8 7 5" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M12 20s6-5.2 6-9a6 6 0 1 0-12 0c0 3.8 6 9 6 9z" />
          <circle cx="12" cy="11" r="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}

import type { ReactNode } from "react";

/** Pictogrammes (trait) partagés par les refontes À propos, Contact et Centre d’aide. */
export type GlyphName =
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "play"
  | "car"
  | "search"
  | "fork"
  | "fuel"
  | "plug"
  | "snow"
  | "speaker"
  | "leaf"
  | "excavator"
  | "share"
  | "lock"
  | "laptop"
  | "users"
  | "doc"
  | "phone"
  | "whatsapp"
  | "pin"
  | "book"
  | "handshake"
  | "truck"
  | "chat"
  | "gear"
  | "user"
  | "plus"
  | "minus"
  | "chevronDown"
  | "chevronRight"
  | "file";

const glyphs: Record<GlyphName, ReactNode> = {
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  car: (
    <>
      <path d="M4 15v-3.2l1.6-4A2 2 0 0 1 7.5 6.5h9a2 2 0 0 1 1.9 1.3l1.6 4V15" />
      <path d="M3 15h18v3H3z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
      <path d="M6 11h12" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  fork: <path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 3c-2 2-2.5 5-2.5 8h2.5v10" />,
  fuel: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M4 21h12" />
      <path d="M7.5 7h5v4h-5zM15 9h2.2a1.8 1.8 0 0 1 1.8 1.8V17a1.5 1.5 0 0 0 3 0V9l-3-3" />
    </>
  ),
  plug: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M7 7V5M17 7V5M12 10l-2 3h4l-2 3" />
    </>
  ),
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" />,
  speaker: (
    <>
      <path d="M4 10v4h3.5L12 18V6L7.5 10z" />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  leaf: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8" />,
  excavator: (
    <>
      <path d="M3 18h12M4.5 18v-3h8v3M6 15v-4h4l1.5 4" />
      <path d="M11 11l4-6 4 3-2 6" />
      <path d="M17 14l3 1.5-1.5 2.5" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="17.5" cy="6" r="2.4" />
      <circle cx="17.5" cy="18" r="2.4" />
      <path d="M8.2 10.8l7.2-3.6M8.2 13.2l7.2 3.6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M2.5 19h19l-1.6-4H4.1z" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="8" r="2.8" />
      <circle cx="5.5" cy="10" r="2" />
      <circle cx="18.5" cy="10" r="2" />
      <path d="M7.5 19v-1.2A3.8 3.8 0 0 1 11.3 14h1.4a3.8 3.8 0 0 1 3.8 3.8V19" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M9 11h6M9 14.5h6M9 18h4" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </>
  ),
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />,
  whatsapp: (
    <>
      <path d="M4 20l1.2-4.1A8 8 0 1 1 8.2 18.9z" />
      <path d="M9 8.5c.2 3 2.7 5.6 6 6.2l1-1.4-2-1-1 .7a4.5 4.5 0 0 1-2-2l.7-1-1-2z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 15.3 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  book: <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5M12 6.5C14 5 17 4.5 20 5v13c-3-.5-6 0-8 1.5M12 6.5v13" />,
  handshake: (
    <>
      <path d="M2.5 11l4-3 4 1.5L14 8l3.5 2M21.5 11l-4-3" />
      <path d="M6.5 8L2.5 11l5 5 2.5-1M17.5 10l4 1-5.5 5.5-5-4.5" />
      <path d="M8 16l2.5 2.5M11 14.5l2.5 2.5" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6h11v10h-11zM13.5 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H11l-4.5 3.5V16H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
};

type Props = { name: GlyphName; className?: string };

export function AbtIcon({ name, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  );
}
import type { ReactNode } from "react";

/** Pictogrammes de l’accueil (trait 1.8, couleur héritée). */
export type HomGlyph =
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "plus"
  | "chevronDown"
  | "chevronRight"
  | "play"
  | "bars"
  | "bell"
  | "doc"
  | "user"
  | "puzzle"
  | "layers"
  | "medal"
  | "rosette"
  | "ribbon"
  | "pin"
  | "list"
  | "van"
  | "excavator"
  | "truck";

const glyphs: Record<HomGlyph, ReactNode> = {
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  bars: (
    <>
      <rect x="3.5" y="13" width="4.5" height="7.5" rx="1" />
      <rect x="9.75" y="8" width="4.5" height="12.5" rx="1" />
      <rect x="16" y="3.5" width="4.5" height="17" rx="1" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0M19 4l1.5-1.5M21 7.5h1.5" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 15.5h6M9 8.5h2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.5v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
    </>
  ),
  puzzle: (
    <path d="M4 9h3.2a2.2 2.2 0 1 1 4.4 0H15v3.2a2.2 2.2 0 1 1 0 4.4V20H4v-4.4a2.2 2.2 0 1 0 0-4.4zM15 4h5v5h-3.2a2.2 2.2 0 1 0-1.8 0z" />
  ),
  layers: (
    <>
      <path d="M12 3.5l9 4.5-9 4.5L3 8z" />
      <path d="M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5" />
    </>
  ),
  medal: (
    <>
      <path d="M8 3h3l1 4-2.5 1.5zM16 3h-3l-1 4 2.5 1.5z" />
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M12 11.7l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3z" />
    </>
  ),
  rosette: (
    <>
      <path d="M12 2.5l2.2 1.6 2.7-.1.9 2.6 2.2 1.6-.8 2.6.8 2.6-2.2 1.6-.9 2.6-2.7-.1-2.2 1.6-2.2-1.6-2.7.1-.9-2.6L4.1 14l.8-2.6-.8-2.6 2.2-1.6.9-2.6 2.7.1z" />
      <path d="M12 8l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14l-2 7.5L12 18.5l5.5 3-2-7.5" />
      <path d="M12 6.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  list: <path d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20M4 6.5h.01M4 12h.01M4 17.5h.01" />,
  van: (
    <>
      <path d="M2.5 16.5V8.5a1.5 1.5 0 0 1 1.5-1.5h9.5a1.5 1.5 0 0 1 1.2.6L18.8 12h1.7a1 1 0 0 1 1 1v3.5" />
      <path d="M14.5 7.5V12h4.3M2.5 16.5h2.2M8.8 16.5h5M19.3 16.5h2.2" />
      <circle cx="6.7" cy="16.7" r="2" />
      <circle cx="17.3" cy="16.7" r="2" />
    </>
  ),
  excavator: (
    <>
      <path d="M3 18.5h12M5 18.5v-3.5h8v3.5M8.5 15V10h4l1 5" />
      <path d="M12.5 10l3.5-5.5 4 1.5M20 6l-1.5 5.5 2 1.5" />
      <circle cx="6.5" cy="18.8" r=".6" />
      <circle cx="10.5" cy="18.8" r=".6" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 16.5V7.5h11v9M13.5 10.5H18l2.5 3v3h-7" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 10.5h6" />
    </>
  ),
};

type Props = { name: HomGlyph; className?: string };

export function HomIcon({ name, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
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
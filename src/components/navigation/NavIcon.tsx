import type { SVGProps } from "react";
import type { NavIconId } from "@/types/navigation";

type NavIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  id: NavIconId;
};

/** Pictogrammes filaires de la navigation (hérite de `currentColor`). */
export function NavIcon({ id, ...props }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {paths[id]}
    </svg>
  );
}

const paths: Record<NavIconId, React.ReactNode> = {
  excavator: (
    <>
      <rect x="3" y="22" width="15" height="5" rx="2.5" />
      <path d="M6 22v-6h8v6M14 16l1.5-3.5L12 5.5l8-1.5 5.5 12M20 4l1.5 3M25.5 16l2.5 3.5-3 .5" />
      <path d="M11 5.5l9 .5" />
    </>
  ),
  pin: (
    <>
      <path d="M16 28S7 20 7 12.5a9 9 0 0 1 18 0C25 20 16 28 16 28Z" />
      <circle cx="16" cy="12.5" r="3.2" />
    </>
  ),
  cog: (
    <>
      <circle cx="16" cy="16" r="4.2" />
      <circle cx="16" cy="16" r="9" />
      <path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8" />
    </>
  ),
  van: (
    <>
      <path d="M3 22V10a1.5 1.5 0 0 1 1.5-1.5H19V22M19 13h5l5 5v4h-3M3 22h3M12 22h7" />
      <circle cx="9" cy="23" r="3" />
      <circle cx="23.5" cy="23" r="3" />
    </>
  ),
  bike: (
    <>
      <circle cx="7" cy="21" r="4.5" />
      <circle cx="25.5" cy="21" r="4.5" />
      <path d="M7 21l5-8h6l3 5M18 13l-2-4h-3M21 18h4.5M12 13l3 8h6" />
    </>
  ),
  drill: (
    <>
      <path d="M3 10h14a4 4 0 0 1 4 4v3h-9l-1.5 3H3zM21 14h6M27 12v4M9.5 20 8 28h5.5l1-8" />
    </>
  ),
  signal: (
    <>
      <circle cx="16" cy="16" r="2" />
      <path d="M11.2 11.2a6.8 6.8 0 0 0 0 9.6M20.8 11.2a6.8 6.8 0 0 1 0 9.6M7 7a12.7 12.7 0 0 0 0 18M25 7a12.7 12.7 0 0 1 0 18M16 18v9" />
    </>
  ),
  document: (
    <>
      <path d="M9 4h10l6 6v18H9z" />
      <path d="M19 4v6h6M13 16h8M13 21h8" />
    </>
  ),
  "document-gear": (
    <>
      <path d="M6 5h11l5 5v6M6 5v21h9M17 5v5h5M10 13h8M10 18h4" />
      <circle cx="23" cy="23" r="2.6" />
      <circle cx="23" cy="23" r="5.2" />
      <path d="M23 15.5v2M23 28.5v2M15.5 23h2M28.5 23h2" />
    </>
  ),
  team: (
    <>
      <circle cx="16" cy="9" r="3.6" />
      <path d="M9.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="6" cy="14" r="2.8" />
      <circle cx="26" cy="14" r="2.8" />
      <path d="M2.5 23a4.5 4.5 0 0 1 4.5-4.5M29.5 23a4.5 4.5 0 0 0-4.5-4.5M6 26h20" />
    </>
  ),
  chat: (
    <>
      <path d="M5 6h22v16H16l-6 5v-5H5z" />
      <path d="M11 14h.01M16 14h.01M21 14h.01" strokeWidth={2.4} />
    </>
  ),
  info: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 15v7M16 10.5h.01" strokeWidth={2} />
    </>
  ),
  preview: (
    <>
      <rect x="4" y="6" width="24" height="20" rx="3" />
      <path d="M4 12h24M9 9h.01M13 9h.01M9 17h8M9 21h5M20 17h4v4h-4z" />
    </>
  ),
  handshake: (
    <>
      <path d="M2 14l5-5 6 1 4-2 6 4 7-2M7 9l-5 6 6 7M30 8v8l-7 6M13 10l5 4-4 3a2 2 0 0 0 3 3l3-2M10 21l3 3a2 2 0 0 0 3-1M20 22l-2 3a2 2 0 0 0 3 1l3-2" />
    </>
  ),
  network: (
    <>
      <circle cx="16" cy="7" r="3.2" />
      <circle cx="7" cy="23" r="3.2" />
      <circle cx="25" cy="23" r="3.2" />
      <path d="M14.5 10l-6 10M17.5 10l6 10M10.2 23h11.6" />
    </>
  ),
  grid: (
    <>
      <rect x="5" y="5" width="9" height="9" rx="2" />
      <rect x="18" y="5" width="9" height="9" rx="2" />
      <rect x="5" y="18" width="9" height="9" rx="2" />
      <rect x="18" y="18" width="9" height="9" rx="2" />
    </>
  ),
  building: (
    <>
      <path d="M5 28V11l9-5v22M14 12h12v16M3 28h26" />
      <path d="M8.5 14.5h2M8.5 19h2M8.5 23.5h2M18 17h4M18 22h4" />
    </>
  ),
};

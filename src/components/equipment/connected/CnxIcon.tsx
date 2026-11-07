import type { ReactNode } from "react";

export type CnxIconName =
  | "plug"
  | "signalBars"
  | "alertTriangle"
  | "device"
  | "map"
  | "engine"
  | "bike"
  | "checkSquare"
  | "cubes"
  | "chatLines"
  | "mapRoute"
  | "wrench"
  | "pin"
  | "bell"
  | "monitor"
  | "arrowUpRight"
  | "arrowDownRight"
  | "arrowRight"
  | "chevronRight"
  | "chevronDown"
  | "chevronUp"
  | "plus"
  | "minus"
  | "info"
  | "van"
  | "truck"
  | "excavator"
  | "cart"
  | "shield"
  | "gear"
  | "users"
  | "chart"
  | "route"
  | "zone"
  | "report"
  | "list"
  | "clock"
  | "stop"
  | "layers"
  | "search"
  | "home"
  | "close"
  | "target"
  | "file"
  | "eye"
  | "user"
  | "helmet"
  | "upload"
  | "clipboard"
  | "shieldCheck"
  | "box"
  | "car"
  | "laptop"
  | "puzzle"
  | "database"
  | "book"
  | "folder"
  | "plusSquare"
  | "check"
  | "arrowDown"
  | "phone"
  | "stack"
  | "bolt"
  | "broom"
  | "wall"
  | "calendar"
  | "dots"
  | "headset"
  | "clipboardCheck"
  | "handshake"
  | "chat"
  | "userPlus"
  | "mail"
  | "image"
  | "trash"
  | "whatsapp"
  | "circlePlus"
  | "crane"
  | "grid"
  | "gauge"
  | "coin"
  | "fuel"
  | "userCog"
  | "help"
  | "building"
  | "road"
  | "radar"
  | "notePen"
  | "sliders";

const paths: Record<CnxIconName, ReactNode> = {
  plug: (<><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" /><path d="M12 17v4" /></>),
  signalBars: (<><path d="M5 20v-4M10 20v-8M15 20v-12M20 20V4" /></>),
  alertTriangle: (<><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17h.01" /></>),
  device: (<><rect x="6" y="3" width="12" height="18" rx="2.5" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" /></>),
  map: (<><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>),
  engine: (<><path d="M4 9h3l1-2h6v2h3l2 2v5H4zM4 12H2M20 12h2" /></>),
  bike: (<><circle cx="5.5" cy="16.5" r="3" /><circle cx="18.5" cy="16.5" r="3" /><path d="M5.5 16.5 9 10h5l2.5 6.5M9 10 7.5 8H6M14 10l-1-3h2.5M12 16.5h4" /></>),
  checkSquare: (<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
  cubes: (<><path d="m8 3 4 2.2v4.6L8 12 4 9.8V5.2z" /><path d="m16 11 4 2.2v4.6L16 20l-4-2.2v-4.6z" /><path d="m8 12 4 2.2v4.6L8 21l-4-2.2v-4.6z" /></>),
  chatLines: (<><path d="M4 5h16v11h-9l-4 4v-4H4z" /><path d="M8 9h8M8 12h5" /></>),
  mapRoute: (<><path d="M12 3a5 5 0 0 1 5 5c0 3.5-5 9-5 9s-5-5.5-5-9a5 5 0 0 1 5-5z" /><circle cx="12" cy="8" r="1.6" /><path d="M6 21c0-2 1-3 3-3h6M18 21h.01" /></>),
  wrench: (<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />),
  pin: (<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>),
  bell: (<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>),
  monitor: (<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>),
  arrowUpRight: (<path d="M7 17 17 7M8 7h9v9" />),
  arrowDownRight: (<path d="M7 7l10 10M17 8v9H8" />),
  arrowRight: (<path d="M5 12h14M12 5l7 7-7 7" />),
  chevronRight: (<path d="m9 6 6 6-6 6" />),
  chevronDown: (<path d="m6 9 6 6 6-6" />),
  chevronUp: (<path d="m6 15 6-6 6 6" />),
  plus: (<path d="M12 5v14M5 12h14" />),
  minus: (<path d="M5 12h14" />),
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  van: (<><path d="M2 16V7a1 1 0 0 1 1-1h9v10" /><path d="M12 9h4.2a1 1 0 0 1 .8.4L20.4 13a1 1 0 0 1 .2.6V16" /><path d="M2 16h2M8 16h6M18 16h3" /><circle cx="6" cy="17" r="2" /><circle cx="16" cy="17" r="2" /></>),
  truck: (<><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>),
  excavator: (<><path d="M3 18h12M4 18v-3h9v3" /><path d="M8 15v-4h4l1 4" /><path d="M10 11 8 6l7-3 4 5-3 5" /><path d="M18 13l2 2-2 2-2-2" /></>),
  cart: (<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>),
  shield: (<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />),
  gear: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
  users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  chart: (<path d="M5 21v-9M12 21V4M19 21v-6" />),
  route: (<><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>),
  zone: (<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />),
  report: (<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>),
  list: (<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />),
  clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  stop: (<rect x="5" y="5" width="14" height="14" rx="2" />),
  layers: (<><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></>),
  search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  home: (<><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>),
  close: (<path d="M18 6 6 18M6 6l12 12" />),
  target: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>),
  file: (<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><path d="M14 2v6h6" /></>),
  eye: (<><><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></></>),
  user: (<><><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></></>),
  helmet: (<><><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2 16h20v3H2zM12 8v8M8.5 9.5 9.5 16M15.5 9.5 14.5 16" /></></>),
  upload: (<><><path d="M12 15V3M7 8l5-5 5 5" /><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></></>),
  clipboard: (<><><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></></>),
  shieldCheck: (<><><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></></>),
  box: (<><><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></></>),
  car: (<><><path d="M5 17H3v-5l2-5h14l2 5v5h-2" /><path d="M3 12h18" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /></></>),
  laptop: (<><><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 20h20" /></></>),
  puzzle: (<><path d="M10 4a2 2 0 1 1 4 0v1h4v4h1a2 2 0 1 1 0 4h-1v4h-4v-1a2 2 0 1 0-4 0v1H6v-4H5a2 2 0 1 1 0-4h1V5h4z" /></>),
  database: (<><><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></></>),
  book: (<><><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M9 8h6" /></></>),
  folder: (<><path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>),
  plusSquare: (<><><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8M8 12h8" /></></>),
  check: (<><path d="m5 12 5 5 9-10" /></>),
  arrowDown: (<><path d="M12 5v14M5 12l7 7 7-7" /></>),
  phone: (<><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z" /></>),
  stack: (<><><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></></>),
  bolt: (<><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></>),
  broom: (<><><path d="M19 3 11 11" /><path d="M9.5 9.5 13 13c-1 3-3 5-8 6 .5-3 1.5-6 4.5-9.5z" /><path d="M7 15l2 2" /></></>),
  wall: (<><><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9.5h18M3 14.5h18M12 4v5.5M8 9.5v5M16 9.5v5M12 14.5V20" /></></>),
  calendar: (<><><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></></>),
  dots: (<><path d="M5 12h.01M12 12h.01M19 12h.01" /></>),
  headset: (<><><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.7-2 3-5 3h-2" /></></>),
  clipboardCheck: (<><><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 14l2 2 4-4" /></></>),
  handshake: (<><><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2" /><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1.4 1.4 0 0 0 2-2" /><path d="M3 4h8" /><path d="m13 7-3.5 3.5a2.1 2.1 0 0 0 3 3l1.5-1.5" /></></>),
  chat: (<><><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8 10h8M8 14h5" /></></>),
  userPlus: (<><><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M19 8v6M16 11h6" /></></>),
  mail: (<><><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></></>),
  image: (<><><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4-4L5 21" /></></>),
  trash: (<><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></>),
  whatsapp: (<><><path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.2-2-1-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-1-2z" /></></>),
  circlePlus: (<><><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></></>),
  crane: (<><path d="M3 21h12M5 21v-4h8v4" /><path d="M7 17 9 4l10 8" /><path d="M9 4 5 17M17 11v6" /><circle cx="17" cy="19" r="1.5" /></>),
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  gauge: (<><path d="M4 18a9 9 0 1 1 16 0" /><path d="M12 14l4-4M3 18h18" /></>),
  coin: (<><circle cx="12" cy="12" r="9" /><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-1.9-.4-2.5-1.2M12 6v2M12 16v2" /></>),
  fuel: (<><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12" /><path d="M7 7h4v4H7zM14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V9l-3-3" /></>),
  userCog: (<><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2" /><circle cx="18" cy="17" r="2.2" /><path d="M18 12.5v1.3M18 20.2v1.3M13.9 17h1.3M20.8 17h1.3" /></>),
  help: (<><circle cx="12" cy="12" r="10" /><path d="M9.5 9a2.6 2.6 0 0 1 5 1c0 1.8-2.5 2.2-2.5 4M12 17.5h.01" /></>),
  building: (<><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M3 21h18" /></>),
  road: (<><path d="M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v3" /></>),
  radar: (<><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" /></>),
  notePen: (<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M14 3l5 5v2M8 9h4M8 13h4M8 17h2" /><path d="m21 14-7 7-3 .7.7-3 7-7a1.4 1.4 0 0 1 2 2z" /></>),
  sliders: (<><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>),
};

type Props = { name: CnxIconName; className?: string; strokeWidth?: number };

export function CnxIcon({ name, className, strokeWidth = 1.7 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

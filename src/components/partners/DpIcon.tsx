export type DpIconName =
  | "laptop" | "sliders" | "calendar" | "user" | "box" | "doc"
  | "stroller" | "van" | "excavator" | "moto" | "tools" | "connected"
  | "arrow" | "info" | "stack" | "list" | "home" | "help" | "mail" | "eye" | "eyeOff" | "lock" | "shield" | "layers" | "pen" | "bell" | "headset" | "chevron"
  | "phone" | "pin" | "briefcase" | "camera" | "folder" | "shop" | "chat" | "check" | "clock" | "shieldCheck" | "shieldClock" | "plus" | "fridge" | "chair" | "plates"
  | "tag" | "coins" | "send" | "trash" | "gear" | "search"
  | "pause" | "upload" | "quote" | "hourglass" | "xCircle" | "calendarX";

export function DpIcon({ name, className }: { name: DpIconName; className?: string }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true as const, focusable: false as const };
  const s = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "laptop":
      return <svg {...common}><rect x="3" y="5" width="18" height="12" rx="1.5" {...s} /><path d="M2 19h20" {...s} /></svg>;
    case "sliders":
      return <svg {...common}><path d="M4 8h16M4 16h16" {...s} /><circle cx="9" cy="8" r="2" {...s} /><circle cx="15" cy="16" r="2" {...s} /></svg>;
    case "calendar":
      return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" {...s} /><path d="M8 3v4M16 3v4M3 10h18M8 16l2 2 4.5-4.5" {...s} /></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="3.2" {...s} /><path d="M5 19c1.2-3.2 3.5-5 7-5s5.8 1.8 7 5" {...s} /></svg>;
    case "box":
      return <svg {...common}><path d="M3 8 12 4l9 4-9 4-9-4Z" {...s} /><path d="M3 8v8l9 4 9-4V8M12 12v8" {...s} /></svg>;
    case "doc":
      return <svg {...common}><path d="M7 3h7l5 5v13H7V3Z" {...s} /><path d="M14 3v5h5M9 13h6M9 17h6" {...s} /></svg>;
    case "stroller":
      return <svg {...common}><circle cx="7" cy="19" r="2" {...s} /><circle cx="16" cy="19" r="2" {...s} /><path d="M14 5h4l2 8H8L6 5M8 13l-3 6" {...s} /></svg>;
    case "van":
      return <svg {...common}><path d="M3 15V9h11l5 4v2H3Z" {...s} /><circle cx="7" cy="17" r="1.7" {...s} /><circle cx="16" cy="17" r="1.7" {...s} /></svg>;
    case "excavator":
      return <svg {...common}><path d="M3 17h10V9H7l-4 4v4Z" {...s} /><path d="M13 11h4l3-5" {...s} /><circle cx="6" cy="19" r="1.6" {...s} /><circle cx="12" cy="19" r="1.6" {...s} /></svg>;
    case "moto":
      return <svg {...common}><circle cx="6" cy="17" r="2.3" {...s} /><circle cx="18" cy="17" r="2.3" {...s} /><path d="M8 17h6l3-7H11l-3 7M14 10h4" {...s} /></svg>;
    case "tools":
      return <svg {...common}><path d="M8 15 4 19l2 2 4-4M14 4l6 6-3 3-6-6 3-3Z" {...s} /><path d="M11 10 4 3" {...s} /></svg>;
    case "connected":
      return <svg {...common}><circle cx="12" cy="12" r="2" {...s} /><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7 7l1.5 1.5M15.5 15.5 17 17M17 7l-1.5 1.5M7 17l1.5-1.5" {...s} /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" {...s} /></svg>;
    case "info":
      return <svg {...common}><circle cx="12" cy="12" r="9" {...s} /><path d="M12 10v6M12 7.5v.5" {...s} /></svg>;
    case "stack":
      return <svg {...common}><path d="M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" {...s} /></svg>;
    case "list":
      return <svg {...common}><rect x="6" y="3" width="12" height="18" rx="1.6" {...s} /><path d="M9 8h6M9 12h6M9 16h4" {...s} /></svg>;
    case "home":
      return <svg {...common}><path d="M4 11 12 4l8 7v9H4v-9Z" {...s} /><path d="M10 20v-6h4v6" {...s} /></svg>;
    case "help":
      return <svg {...common}><circle cx="12" cy="12" r="9" {...s} /><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8V14" {...s} /><path d="M12 17h.01" {...s} /></svg>;
    case "mail":
      return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" {...s} /><path d="m4 8 8 6 8-6" {...s} /></svg>;
    case "eye":
      return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" {...s} /><circle cx="12" cy="12" r="2.5" {...s} /></svg>;
    case "lock":
      return <svg {...common}><rect x="6" y="11" width="12" height="9" rx="2" {...s} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...s} /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" {...s} /></svg>;
    case "layers":
      return <svg {...common}><path d="M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" {...s} /></svg>;
    case "pen":
      return <svg {...common}><path d="M4 20h4L19 9l-4-4L4 16v4Z" {...s} /></svg>;
    case "bell":
      return <svg {...common}><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z" {...s} /><path d="M10 19a2 2 0 0 0 4 0" {...s} /></svg>;
    case "headset":
      return <svg {...common}><path d="M4 13v-2a8 8 0 0 1 16 0v2" {...s} /><rect x="3" y="13" width="4" height="7" rx="1.5" {...s} /><rect x="17" y="13" width="4" height="7" rx="1.5" {...s} /></svg>;
    case "chevron":
      return <svg {...common}><path d="M7 10l5 5 5-5" {...s} /></svg>;
    case "phone":
      return <svg {...common}><path d="M7 3.8h3.2l1 3.2-2 1.2a12 12 0 0 0 6.6 6.6l1.2-2 3.2 1V17a2 2 0 0 1-2.2 2A16 16 0 0 1 5 6.2 2 2 0 0 1 7 3.8Z" {...s} /></svg>;
    case "pin":
      return <svg {...common}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" {...s} /><circle cx="12" cy="10" r="2.2" {...s} /></svg>;
    case "briefcase":
      return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" {...s} /><path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M3 13h18" {...s} /></svg>;
    case "camera":
      return <svg {...common}><path d="M8 7 9.2 5h5.6L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3Z" {...s} /><circle cx="12" cy="13" r="3.2" {...s} /></svg>;
    case "folder":
      return <svg {...common}><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-10Z" {...s} /></svg>;
    case "shop":
      return <svg {...common}><path d="M3 10.5 5.2 4h13.6L21 10.5H3Z" {...s} /><path d="M4 10.5V20h16v-9.5M10 20v-6h4v6M7.5 10.5V8.8M12 10.5V8.8M16.5 10.5V8.8" {...s} /></svg>;
    case "chat":
      return <svg {...common}><path d="M6 16.5 4 20l4-1.2A8.5 8.5 0 1 0 6 16.5Z" {...s} /><path d="M9 10h.01M12 10h.01M15 10h.01" {...s} /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 5 5 9-10" {...s} /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" {...s} /><path d="M12 7.5V12l3 2" {...s} /></svg>;
    case "shieldCheck":
      return <svg {...common}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" {...s} /><path d="m8.5 12 2.3 2.3 4.7-5" {...s} /></svg>;
    case "shieldClock":
      return <svg {...common}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" {...s} /><circle cx="12" cy="11.5" r="3.4" {...s} /><path d="M12 10v1.8l1.3.8" {...s} /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" {...s} /></svg>;
    case "fridge":
      return <svg {...common}><path d="M7 3h10v18H7V3Z" {...s} /><path d="M7 11h10M14 6.5v2M14 14v2" {...s} /></svg>;
    case "chair":
      return <svg {...common}><path d="M7 11h10v3H7v-3Z" {...s} /><path d="M8 11V6h8v5M8 14v6M16 14v6M7 20h3M14 20h3" {...s} /></svg>;
    case "plates":
      return <svg {...common}><circle cx="12" cy="12" r="7.5" {...s} /><circle cx="12" cy="12" r="3.2" {...s} /></svg>;

    case "eyeOff":
      return <svg {...common}><path d="M3 5l18 14M10 10.2A3 3 0 0 0 13.8 14M7 7.3C4.4 8.8 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1M9.5 6.2C10.3 6.1 11.1 6 12 6c6.5 0 10 7 10 7s-.8 1.6-2.3 3.1" {...s} /></svg>;
    case "tag":
      return <svg {...common}><path d="M3 12.5V5h7.5L21 15.5 13.5 23 3 12.5Z" {...s} /><circle cx="8" cy="9" r="1.3" {...s} /></svg>;
    case "coins":
      return <svg {...common}><ellipse cx="10" cy="8" rx="6" ry="3" {...s} /><path d="M4 8v5c0 1.7 2.7 3 6 3s6-1.3 6-3V8" {...s} /><path d="M16 10.2c2.4.4 4 1.5 4 2.8v4c0 1.6-2.2 3-5 3-1.7 0-3.2-.5-4.1-1.3" {...s} /></svg>;
    case "send":
      return <svg {...common}><path d="M4 11.5 20 4 13 20l-2-6-6-2.5Z" {...s} /><path d="m11 14 9-10" {...s} /></svg>;
    case "trash":
      return <svg {...common}><path d="M5 7h14M9 7V5h6v2M8 7l.7 12h6.6L16 7" {...s} /></svg>;
    case "gear":
      return <svg {...common}><circle cx="12" cy="12" r="3" {...s} /><path d="M12 3.2 12.8 5.2c.62.12 1.2.35 1.73.66l1.95-.7.9 1.56-1.5 1.4c.22.52.36 1.08.4 1.66l2.02.54v1.8l-2.02.54a6.2 6.2 0 0 1-.4 1.66l1.5 1.4-.9 1.56-1.95-.7a6.2 6.2 0 0 1-1.73.66L12 20.8l-.8-2c-.62-.12-1.2-.35-1.73-.66l-1.95.7-.9-1.56 1.5-1.4a6.2 6.2 0 0 1-.4-1.66l-2.02-.54v-1.8l2.02-.54c.04-.58.18-1.14.4-1.66l-1.5-1.4.9-1.56 1.95.7c.53-.31 1.11-.54 1.73-.66L12 3.2Z" {...s} /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="6.5" {...s} /><path d="M16 16l4.5 4.5" {...s} /></svg>;
    case "pause":
      return <svg {...common}><path d="M8 6h3v12H8zM13 6h3v12h-3z" {...s} /></svg>;
    case "upload":
      return <svg {...common}><path d="M12 16V7M8.5 10.5 12 7l3.5 3.5M5 18h14" {...s} /></svg>;
    case "quote":
      return <svg {...common}><path d="M7 11h5v7H6v-5c0-3 2-5 5-6M14 11h5v7h-6v-5c0-3 2-5 5-6" {...s} /></svg>;
    case "hourglass":
      return <svg {...common}><path d="M7 4h10M7 20h10M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8" {...s} /></svg>;
    case "xCircle":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" {...s} /><path d="m9 9 6 6M15 9l-6 6" {...s} /></svg>;
    case "calendarX":
      return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" {...s} /><path d="M8 3v4M16 3v4M3 10h18M9 14.5l6 6M15 14.5l-6 6" {...s} /></svg>;

    default:
      return null;
  }
}

import type { ReactNode } from "react";
import type { ExpIconName } from "@/content/expertise-hub";

const gearPath =
  "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z";

const icons: Record<ExpIconName, ReactNode> = {
  docSearch: (
    <>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M13 3l5 5v2" />
      <path d="M13 3v5h5" />
      <circle cx="16" cy="16" r="3" />
      <path d="M18.2 18.2L21 21" />
      <path d="M8.5 12h3M8.5 16h1.5" />
    </>
  ),
  gear: (
    <>
      <path d={gearPath} />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5.5" r="2.3" />
      <circle cx="5.5" cy="17.5" r="2.3" />
      <circle cx="18.5" cy="17.5" r="2.3" />
      <path d="M10.8 7.6L6.7 15.4M13.2 7.6l4.1 7.8M8 17.5h8" />
    </>
  ),
  chart: (
    <>
      <path d="M3 21h18" />
      <rect x="5" y="12" width="3.5" height="7" rx=".6" />
      <rect x="10.25" y="6" width="3.5" height="13" rx=".6" />
      <rect x="15.5" y="9.5" width="3.5" height="9.5" rx=".6" />
    </>
  ),
  graduation: (
    <>
      <path d="M22 10v6" />
      <path d="M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </>
  ),
  nodes: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="4.8" cy="5.5" r="1.8" />
      <circle cx="19.2" cy="5.5" r="1.8" />
      <circle cx="4.8" cy="18.5" r="1.8" />
      <circle cx="19.2" cy="18.5" r="1.8" />
      <path d="M6.2 6.7l3.8 3.4M17.8 6.7l-3.8 3.4M6.2 17.3l3.8-3.4M17.8 17.3l-3.8-3.4" />
    </>
  ),
  people: (
    <>
      <circle cx="8" cy="9" r="2.6" />
      <path d="M3 19v-1.5A3.5 3.5 0 0 1 6.5 14h3A3.5 3.5 0 0 1 13 17.5V19" />
      <path d="M15 4h5a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 20 10h-2.2l-2 2v-2H15a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 15 4z" />
    </>
  ),
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
};

export function ExpIcon({ name, className }: { name: ExpIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name]}
    </svg>
  );
}
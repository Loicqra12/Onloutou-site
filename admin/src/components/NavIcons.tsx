import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M12 3.2 3 11h2v9h6v-6h2v6h6v-9h2L12 3.2Z" />
    </Svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 7.3-7.3 1.4 1.4-8.7 8.7ZM5 19h14v2H5v-2Z"
      />
    </Svg>
  );
}

export function IconChart({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M4 20V9h3v11H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z" />
    </Svg>
  );
}

export function IconFolder({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2Z" />
    </Svg>
  );
}

export function IconTruck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M3 6h11v9H3V6Zm12 3h3.5L21 12.5V15h-6V9ZM6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      />
    </Svg>
  );
}

export function IconAlert({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" />
    </Svg>
  );
}

export function IconBox({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Zm9 2.2 6.4-3.2L12 5.2 5.6 6.5 12 9.7Z" />
    </Svg>
  );
}

export function IconPark({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M4 20V8l8-5 8 5v12H4Zm8-3 5-5h-3V8h-4v4H7l5 5Z" />
    </Svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="m22.7 19-8.1-8.1A6 6 0 0 0 7.2 3.2L11 7l-4 4-3.8-3.8A6 6 0 0 0 10.9 14.6L19 22.7 22.7 19Z"
      />
    </Svg>
  );
}

export function IconPeople({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm6.5.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5ZM1 20v-1c0-2.8 3.6-5 8-5s8 2.2 8 5v1H1Zm14 0v-1c0-1.3-.6-2.5-1.6-3.4 2.8.4 6.6 1.8 6.6 4.4v1H15Z"
      />
    </Svg>
  );
}

export function IconHandshake({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M11 8.5 7.5 5 2 10.5 6.5 15 11 10.5 16.5 16 22 10.5 17.5 6 13 10.5 11 8.5Z"
      />
    </Svg>
  );
}

export function IconCard({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M2 6h20v12H2V6Zm2 4h16V8H4v2Zm0 6h7v-2H4v2Z" />
    </Svg>
  );
}

export function IconSafe({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M4 4h16v16H4V4Zm8 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
    </Svg>
  );
}

export function IconCash({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M3 6h18v12H3V6Zm9 9a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
    </Svg>
  );
}

export function IconInvoice({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z" />
    </Svg>
  );
}

export function IconTeam({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Zm-7 8v-1.2C5 16.4 8 15 12 15s7 1.4 7 3.8V20H5Z"
      />
    </Svg>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M19.1 12.9a7.5 7.5 0 0 0 0-1.8l2-1.5-2-3.5-2.4 1a7.4 7.4 0 0 0-1.6-.9L14.7 3h-5.4L9 6.2a7.4 7.4 0 0 0-1.6.9l-2.4-1-2 3.5 2 1.5a7.5 7.5 0 0 0 0 1.8l-2 1.5 2 3.5 2.4-1a7.4 7.4 0 0 0 1.6.9l.4 3.2h5.4l.4-3.2a7.4 7.4 0 0 0 1.6-.9l2.4 1 2-3.5-2-1.5ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z"
      />
    </Svg>
  );
}

export function IconShieldNav({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M12 2 4 5v6c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V5l-8-3Z" />
    </Svg>
  );
}

export function IconLog({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M5 4h14v16H5V4Zm3 4h8v2H8V8Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z" />
    </Svg>
  );
}

export function IconHelp({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 16.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm1.6-6.3-.5.5A2.2 2.2 0 0 0 12.4 14h-1v-.6a3.2 3.2 0 0 1 .9-2.2l.7-.7a1.6 1.6 0 1 0-2.7-1.1H8.6a3.5 3.5 0 1 1 6.4 2.4 3 3 0 0 1-1.4 1.1Z"
      />
    </Svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 22a2.3 2.3 0 0 0 2.3-2.2H9.7A2.3 2.3 0 0 0 12 22Zm8-6v-5.2A8 8 0 0 0 13 3.1V2h-2v1.1A8 8 0 0 0 4 10.8V16l-2 2v1h20v-1l-2-2Z"
      />
    </Svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"
      />
    </Svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </Svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
    </Svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8Z"
      />
    </Svg>
  );
}

export function IconWeb({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.9 9h-3.2a15 15 0 0 0-1.4-6 8 8 0 0 1 4.6 6ZM12 4c.9 1.4 1.7 3.4 2.1 5.5H9.9C10.3 7.4 11.1 5.4 12 4ZM4.3 13a8 8 0 0 1 0-2h3.4a16 16 0 0 0 0 2H4.3Zm.8 2h3.2a15 15 0 0 0 1.4 6 8 8 0 0 1-4.6-6ZM12 20c-.9-1.4-1.7-3.4-2.1-5.5h4.2C13.7 16.6 12.9 18.6 12 20Zm2.7-7H9.3a14 14 0 0 1 0-2h5.4a14 14 0 0 1 0 2Zm.4 7a15 15 0 0 0 1.4-6h3.2a8 8 0 0 1-4.6 6Z"
      />
    </Svg>
  );
}

export function IconDocNav({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm4 18H6V4h7v5h5v11Z" />
    </Svg>
  );
}

export function IconWhatsApp({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M19.1 4.9A10 10 0 0 0 3.2 16.3L2 22l5.9-1.2A10 10 0 1 0 19.1 4.9ZM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.7.7-3.4-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1l-.8 1c-.1.1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.1-.3c0-.1 0-.3-.1-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a9.7 9.7 0 0 0 3.7 3.2c.5.2 1 .4 1.3.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3Z"
      />
    </Svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
    </Svg>
  );
}

export function IconCal({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v16H4V4h3V2Zm11 8H6v8h12v-8Z" />
    </Svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="M6 7h12l-1 14H7L6 7Zm3-5h6l1 2h4v2H4V4h4l1-2Z" />
    </Svg>
  );
}

export function IconReset({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        fill="currentColor"
        d="M12 6V1L7 6l5 5V7a5 5 0 1 1-4.9 6H5a7 7 0 1 0 7-7Z"
      />
    </Svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path fill="currentColor" d="m9 6 6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z" />
    </Svg>
  );
}

export const NAV_ICONS = {
  home: IconHome,
  check: IconCheck,
  chart: IconChart,
  folder: IconFolder,
  truck: IconTruck,
  alert: IconAlert,
  box: IconBox,
  park: IconPark,
  wrench: IconWrench,
  people: IconPeople,
  handshake: IconHandshake,
  card: IconCard,
  safe: IconSafe,
  cash: IconCash,
  invoice: IconInvoice,
  team: IconTeam,
  settings: IconSettings,
  shield: IconShieldNav,
  log: IconLog,
  help: IconHelp,
} as const;

export type NavIconName = keyof typeof NAV_ICONS;

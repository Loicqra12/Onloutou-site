import type { ReactNode } from "react";

/**
 * Illustrations décoratives des étapes (location et livraison).
 * Style plat : contour encre, aplats jaune ONLOUTOU. Aucune promesse chiffrée ni de délai.
 */

const INK = "#111";
const YELLOW = "#F5C400";
const PALE = "#FBE69B";
const LINE = "#CFCABB";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      className="step-illu__svg"
      viewBox="0 0 160 100"
      fill="none"
      stroke={INK}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Truck({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="20" y="30" width="58" height="38" rx="3" fill="#fff" />
      <path d="M78 42h20l14 14v12H78z" fill={YELLOW} />
      <path d="M92 46h5l8 9H92z" fill="#fff" />
      <circle cx="40" cy="72" r="9" fill={INK} />
      <circle cx="40" cy="72" r="3" fill={YELLOW} stroke="none" />
      <circle cx="98" cy="72" r="9" fill={INK} />
      <circle cx="98" cy="72" r="3" fill={YELLOW} stroke="none" />
    </g>
  );
}

function Pin({ x, y, fill = YELLOW }: { x: number; y: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0c-9-11-12-16-12-22a12 12 0 0 1 24 0c0 6-3 11-12 22z" fill={fill} />
      <circle cx="0" cy="-22" r="4.5" fill="#fff" />
    </g>
  );
}

/* ---------- Location en 4 étapes ---------- */

export function IlluDescribe() {
  return (
    <Frame>
      <rect x="40" y="10" width="62" height="80" rx="6" fill="#fff" />
      <rect x="50" y="21" width="26" height="6" rx="2" fill={YELLOW} stroke="none" />
      <path d="M50 40h42M50 50h42M50 60h28" stroke={LINE} strokeWidth={3} />
      <rect x="50" y="70" width="10" height="10" rx="2" fill={PALE} />
      <path d="M52.5 75l2 2 3.5-4" strokeWidth={1.8} />
      <g transform="rotate(38 118 56)">
        <rect x="112" y="26" width="12" height="46" rx="2" fill={YELLOW} />
        <path d="M112 72h12l-6 12z" fill="#fff" />
        <path d="M112 34h12" />
      </g>
    </Frame>
  );
}

export function IlluStudy() {
  return (
    <Frame>
      <Truck x={4} y={6} s={0.95} />
      <circle cx="106" cy="40" r="22" fill="#fff" fillOpacity={0.65} strokeWidth={3} />
      <path d="M122 57l18 20" strokeWidth={6} />
      <path d="M96 40a10 10 0 0 1 8-9" strokeWidth={2} stroke={YELLOW} />
    </Frame>
  );
}

export function IlluPropose() {
  return (
    <Frame>
      <rect x="34" y="14" width="58" height="74" rx="6" fill={PALE} transform="rotate(-6 63 51)" />
      <rect x="52" y="10" width="62" height="80" rx="6" fill="#fff" />
      <rect x="52" y="10" width="62" height="16" rx="6" fill={YELLOW} />
      <path d="M62 38h42M62 48h42M62 58h26" stroke={LINE} strokeWidth={3} />
      <circle cx="112" cy="76" r="14" fill={YELLOW} />
      <path d="M105 76l5 5 9-10" strokeWidth={3} />
    </Frame>
  );
}

export function IlluConfirm() {
  return (
    <Frame>
      <circle cx="58" cy="54" r="19" fill={YELLOW} />
      <circle cx="58" cy="54" r="6" fill="#fff" />
      <path d="M76 52h44M104 52v14M116 52v10" strokeWidth={5} />
      <circle cx="118" cy="24" r="13" fill={INK} />
      <path d="M111 24l5 5 9-10" stroke="#fff" strokeWidth={3} />
    </Frame>
  );
}

/* ---------- Livraison ---------- */

export function IlluFeasibility() {
  return (
    <Frame>
      <rect x="14" y="10" width="132" height="80" rx="8" fill="#fff" />
      <path d="M14 40h132M14 66h132M52 10v80M102 10v80" stroke={LINE} strokeWidth={1.2} />
      <path d="M30 72C58 24 88 92 128 40" stroke={INK} strokeWidth={2.4} strokeDasharray="2 7" />
      <circle cx="30" cy="72" r="7" fill={INK} />
      <circle cx="30" cy="72" r="2.5" fill={YELLOW} stroke="none" />
      <Pin x={130} y={44} />
    </Frame>
  );
}

export function IlluConditions() {
  return (
    <Frame>
      <path d="M26 38l28-12 28 12-28 12z" fill={PALE} />
      <path d="M26 38l28 12v32L26 70z" fill={YELLOW} />
      <path d="M54 50l28-12v32L54 82z" fill="#E0AE00" />
      <path d="M40 32l28 12v12" strokeWidth={1.8} />
      <rect x="96" y="18" width="46" height="64" rx="5" fill="#fff" />
      <path d="M103 34l3 3 5-6M103 50l3 3 5-6M103 66l3 3 5-6" strokeWidth={1.8} />
      <path d="M117 34h18M117 50h18M117 66h18" stroke={LINE} strokeWidth={3} />
    </Frame>
  );
}

export function IlluOrganisation() {
  return (
    <Frame>
      <Truck x={4} y={10} s={0.95} />
      <path d="M62 24C74 12 94 12 104 22" stroke={INK} strokeWidth={2.2} strokeDasharray="2 6" />
      <Pin x={118} y={32} />
    </Frame>
  );
}

/* ---------- Devenir livreur : et ensuite ? ---------- */

export function IlluProfileReview() {
  return (
    <Frame>
      <rect x="22" y="22" width="82" height="58" rx="6" fill="#fff" />
      <circle cx="46" cy="46" r="9" fill={YELLOW} />
      <path d="M32 70c2-9 8-12 14-12s12 3 14 12" fill={PALE} />
      <path d="M70 40h24M70 52h24M70 64h14" stroke={LINE} strokeWidth={3} />
      <circle cx="108" cy="46" r="20" fill="#fff" fillOpacity={0.65} strokeWidth={3} />
      <path d="M123 61l17 18" strokeWidth={6} />
    </Frame>
  );
}

export function IlluExchange() {
  return (
    <Frame>
      <path d="M24 20h66a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H54l-14 12V58H24a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill="#fff" />
      <path d="M30 33h48M30 45h30" stroke={LINE} strokeWidth={3} />
      <path d="M72 50h58a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6h-10v10l-14-10H72a6 6 0 0 1-6-6V56a6 6 0 0 1 6-6z" fill={YELLOW} />
      <circle cx="84" cy="67" r="2.4" fill={INK} stroke="none" />
      <circle cx="98" cy="67" r="2.4" fill={INK} stroke="none" />
      <circle cx="112" cy="67" r="2.4" fill={INK} stroke="none" />
    </Frame>
  );
}

export function IlluTerms() {
  return (
    <Frame>
      <circle cx="34" cy="34" r="12" fill={PALE} />
      <circle cx="126" cy="34" r="12" fill={YELLOW} />
      <path d="M22 70c1-10 6-14 12-14s11 4 12 14M114 70c1-10 6-14 12-14s11 4 12 14" />
      <path d="M52 38h56" strokeDasharray="2 7" />
      <rect x="62" y="48" width="36" height="42" rx="4" fill="#fff" />
      <path d="M69 60h22M69 69h22M69 78h12" stroke={LINE} strokeWidth={3} />
    </Frame>
  );
}

/* ---------- Partenaires technologiques : démarche ---------- */

export function IlluContext() {
  return (
    <Frame>
      <rect x="22" y="14" width="116" height="72" rx="7" fill="#fff" />
      <path d="M22 28h116" />
      <circle cx="32" cy="21" r="2" fill={INK} stroke="none" />
      <circle cx="40" cy="21" r="2" fill={INK} stroke="none" />
      <path d="M34 44h30M34 54h30M34 64h20" stroke={LINE} strokeWidth={3} />
      <circle cx="108" cy="58" r="20" fill={PALE} />
      <circle cx="108" cy="58" r="11" fill="#fff" />
      <circle cx="108" cy="58" r="3.5" fill={YELLOW} />
    </Frame>
  );
}

export function IlluCompatibility() {
  return (
    <Frame>
      <rect x="14" y="32" width="48" height="36" rx="6" fill="#fff" />
      <rect x="98" y="32" width="48" height="36" rx="6" fill={YELLOW} />
      <path d="M62 44h12M62 56h12M98 44H86M98 56H86" />
      <rect x="74" y="38" width="12" height="24" rx="3" fill={PALE} />
      <path d="M24 46h28M24 55h18" stroke={LINE} strokeWidth={3} />
      <circle cx="80" cy="18" r="10" fill={INK} />
      <path d="M75 18l4 4 7-8" stroke="#fff" strokeWidth={2.4} />
    </Frame>
  );
}

export function IlluScope() {
  return (
    <Frame>
      <rect x="20" y="14" width="120" height="72" rx="8" strokeDasharray="3 6" />
      <rect x="34" y="28" width="26" height="22" rx="4" fill="#fff" />
      <rect x="67" y="28" width="26" height="22" rx="4" fill={YELLOW} />
      <rect x="100" y="28" width="26" height="22" rx="4" fill="#fff" />
      <rect x="34" y="58" width="59" height="16" rx="4" fill={PALE} />
      <path d="M104 74V58l14 5-14 5" fill={INK} />
    </Frame>
  );
}
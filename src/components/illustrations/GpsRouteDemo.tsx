export function GpsRouteDemo() {
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-ink p-6 text-white"
      role="img"
      aria-label="Schéma de démonstration : tracé GPS et statut de connectivité — données fictives"
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-brand-yellow">
        Interface de démonstration — sans indicateurs chiffrés ni données temps réel.
      </p>
      <svg viewBox="0 0 400 220" className="mt-4 h-auto w-full" aria-hidden>
        <rect width="400" height="220" rx="12" fill="#171717" />
        <path
          d="M40 160 C90 40, 160 200, 220 100 S320 60, 360 140"
          fill="none"
          stroke="#F5C400"
          strokeWidth="3"
          strokeDasharray="8 6"
          className="gps-demo-route"
        />
        <circle cx="40" cy="160" r="8" fill="#F5C400" />
        <circle cx="360" cy="140" r="8" fill="#ffffff" />
        <rect x="24" y="24" width="120" height="48" rx="8" fill="#242424" />
        <text x="36" y="44" fill="#aaa" fontSize="9">Connectivité</text>
        <text x="36" y="60" fill="#78dba7" fontSize="11" fontWeight="bold">Signal OK</text>
        <rect x="256" y="24" width="120" height="48" rx="8" fill="#242424" />
        <text x="268" y="44" fill="#aaa" fontSize="9">Alerte</text>
        <text x="268" y="60" fill="#F5C400" fontSize="11" fontWeight="bold">Géozone</text>
      </svg>
    </div>
  );
}

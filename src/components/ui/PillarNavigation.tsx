"use client";

type PillarLink = {
  id: string;
  label: string;
  number: string;
};

export function PillarNavigation({ items }: { items: PillarLink[] }) {
  return (
    <nav
      aria-label="Piliers solutions"
      className="sticky top-[68px] z-20 border-b border-brand-border bg-brand-white/95 backdrop-blur-sm sm:top-[84px]"
    >
      <div className="container-content flex gap-2 overflow-x-auto py-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-[var(--radius-button)] border border-brand-border px-4 py-2 text-sm font-bold text-brand-ink transition-colors hover:border-brand-yellow hover:text-brand-yellow"
          >
            <span className="mr-2 text-[10px] text-brand-muted">{item.number}</span>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

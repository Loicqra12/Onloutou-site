import Link from "next/link";
import type { SolutionUniverse } from "@/types/services";

export function AudienceEntryCard({ universe }: { universe: SolutionUniverse }) {
  return (
    <article className="interactive-card h-full rounded-[var(--radius-card)] border border-brand-border bg-brand-white shadow-[var(--shadow-card)] transition-colors hover:border-brand-yellow">
    <Link
      href={universe.href}
      className="group flex h-full flex-col p-6"
    >
      <span
        className="grid h-12 w-12 place-items-center rounded-xl bg-brand-charcoal text-xl text-brand-yellow"
        aria-hidden
      >
        {universe.icon}
      </span>
      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-brand-muted">
        {universe.tagline}
      </p>
      <h3 className="mt-1 font-display text-2xl font-extrabold">{universe.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">{universe.summary}</p>
      <ul className="mt-4 space-y-1.5 border-t border-brand-border pt-4 text-sm font-semibold text-brand-ink">
        {universe.capabilities.map((cap) => (
          <li key={cap} className="before:mr-2 before:text-brand-yellow before:content-['↗']">
            {cap}
          </li>
        ))}
      </ul>
      <span className="mt-5 text-sm font-bold text-brand-yellow group-hover:underline">
        Explorer {universe.shortTitle} ↗
      </span>
    </Link>
    </article>
  );
}

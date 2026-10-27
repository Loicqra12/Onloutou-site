import Link from "next/link";

export function PartnerTypeCard({
  title,
  summary,
  href,
  cta,
}: {
  title: string;
  summary: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="interactive-card flex h-full flex-col rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">{summary}</p>
      <Link href={href} className="mt-5 text-sm font-bold text-brand-yellow hover:underline">
        {cta} ↗
      </Link>
    </article>
  );
}

export function WorkPrincipleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="h-full rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-lg font-extrabold text-brand-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-muted">{description}</p>
    </article>
  );
}

import { EditorialNotice } from "@/components/ui/EditorialNotice";

export function CapabilityCard({
  title,
  points,
  notice,
}: {
  title: string;
  points: string[];
  notice?: string;
}) {
  return (
    <article className="interactive-card rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-lg font-extrabold text-brand-ink">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-brand-muted">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-brand-yellow" aria-hidden>↗</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {notice && (
        <div className="mt-4">
          <EditorialNotice>{notice}</EditorialNotice>
        </div>
      )}
    </article>
  );
}

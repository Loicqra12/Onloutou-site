export function ProjectTypeCard({
  title,
  summary,
  topics,
}: {
  title: string;
  summary: string;
  topics: string[];
}) {
  return (
    <article className="interactive-card rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-lg font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-muted">{summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="rounded-full border border-brand-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-muted"
          >
            {topic}
          </li>
        ))}
      </ul>
    </article>
  );
}

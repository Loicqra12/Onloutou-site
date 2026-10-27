export function SectorCard({
  tag,
  title,
  points,
  highlight,
}: {
  tag: string;
  title: string;
  points: string[];
  highlight?: string;
}) {
  return (
    <article className="interactive-card rounded-[var(--radius-card)] border border-[#333333] bg-[#171717] p-7 text-white">
      <span className="inline-block rounded-full border border-[#4c4c4c] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#bbbbbb]">
        {tag}
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm text-[#aaaaaa]">
        {points.map((point) => (
          <li key={point}>↗ {point}</li>
        ))}
      </ul>
      {highlight && (
        <p className="mt-5 rounded-[var(--radius-card)] bg-brand-yellow/10 p-4 text-sm leading-relaxed text-[#e8e8e8]">
          {highlight}
        </p>
      )}
    </article>
  );
}

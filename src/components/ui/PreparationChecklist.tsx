export function PreparationChecklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[var(--radius-card)] border border-brand-border bg-brand-paper px-4 py-3 text-sm font-medium text-brand-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

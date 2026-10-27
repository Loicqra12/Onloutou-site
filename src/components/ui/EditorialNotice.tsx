export function EditorialNotice({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <aside
      className="rounded-[var(--radius-card)] border border-brand-border/80 bg-brand-paper/80 px-3.5 py-2.5 text-xs leading-relaxed text-brand-muted sm:text-sm"
      role="note"
    >
      {title && (
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-muted">
          {title}
        </p>
      )}
      {children}
    </aside>
  );
}

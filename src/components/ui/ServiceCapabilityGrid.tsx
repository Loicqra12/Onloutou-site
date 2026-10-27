import type { ServiceCapability } from "@/types/services";

export function ServiceCapabilityGrid({
  title,
  items,
}: {
  title?: string;
  items: ServiceCapability[];
}) {
  return (
    <section className="section-spacing">
      <div className="container-content">
        {title && (
          <h2 className="font-display text-3xl font-extrabold tracking-tight">{title}</h2>
        )}
        <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${title ? "mt-8" : ""}`}>
          {items.map((item) => (
            <li
              key={item.title}
              className="interactive-card rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="font-display text-lg font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

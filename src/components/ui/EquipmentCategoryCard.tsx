import type { EquipmentCategory } from "@/types/equipment";
import { whatsappUrlForMessage } from "@/content/contact-page";

const modeLabels = {
  rental: "Location",
  sale: "Vente",
  both: "Location & vente",
} as const;

export function EquipmentCategoryCard({ category }: { category: EquipmentCategory }) {
  const whatsappHref = whatsappUrlForMessage(category.requestMessage);

  return (
    <article className="interactive-card flex h-full flex-col rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg bg-brand-paper text-xl"
          aria-hidden
        >
          {category.icon ?? "▣"}
        </span>
        <ul className="flex flex-wrap justify-end gap-1">
          {category.transactionModes.map((mode) => (
            <li
              key={mode}
              className="rounded-full bg-brand-charcoal px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-yellow"
            >
              {modeLabels[mode]}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="mt-4 font-display text-xl font-extrabold">{category.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">{category.summary}</p>
      <div className="mt-5 flex flex-col gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-motion-primary inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] bg-brand-yellow px-4 text-sm font-bold text-brand-ink"
        >
          Demander une disponibilité
        </a>
      </div>
    </article>
  );
}

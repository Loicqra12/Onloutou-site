import { whatsappUrlForMessage } from "@/content/contact-page";
import { site } from "@/content/site";

export function ContactChoiceCard({
  title,
  description,
  whatsappMessage,
}: {
  title: string;
  description: string;
  whatsappMessage: string;
}) {
  const whatsappHref = whatsappUrlForMessage(whatsappMessage);

  return (
    <div className="contact-choice-card interactive-card flex h-full flex-col rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="flex items-center justify-between gap-2 font-display text-lg font-extrabold text-brand-ink">
        {title}
        <span className="contact-choice-arrow text-brand-yellow" aria-hidden>↗</span>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">{description}</p>
      <div className="mt-5 flex flex-col gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pulse-target btn-motion-primary inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] bg-brand-yellow px-4 py-2.5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-yellow-hover"
        >
          Écrire sur WhatsApp
        </a>
        <a
          href={`tel:${site.phoneTel}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] border border-brand-border px-4 py-2.5 text-sm font-bold text-brand-ink hover:border-brand-yellow"
        >
          Appeler {site.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

import type { ServiceFaqItem } from "@/types/services";

export function ServiceFaq({
  title = "Questions fréquentes",
  items,
  openFirst = false,
}: {
  title?: string;
  items: ServiceFaqItem[];
  openFirst?: boolean;
}) {
  return (
    <section className="section-spacing bg-brand-paper" aria-labelledby="service-faq-title">
      <div className="container-content max-w-3xl">
        <h2 id="service-faq-title" className="font-display text-2xl font-extrabold tracking-tight">
          {title}
        </h2>
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <details
              key={item.question}
              open={openFirst && index === 0 ? true : undefined}
              className="group rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-brand-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

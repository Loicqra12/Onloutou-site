import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function ServiceContactCta({
  whatsappHref,
  title = "Parlons de votre besoin",
  description = "Contactez ONLOUTOU par WhatsApp ou par téléphone pour cadrer votre demande.",
}: {
  whatsappHref: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="section-spacing bg-brand-charcoal text-white">
      <div className="container-content max-w-3xl">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#cccccc]">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={whatsappHref} variant="primary">WhatsApp</Button>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] border border-white/25 px-5 text-sm font-bold"
          >
            {site.phoneDisplay}
          </a>
          <Button href="/contact" variant="outline" className="border-white/40 text-white hover:border-brand-yellow">
            Page contact
          </Button>
        </div>
      </div>
    </section>
  );
}

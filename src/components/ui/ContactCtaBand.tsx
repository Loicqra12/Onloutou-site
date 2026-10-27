import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

type ContactCtaBandProps = {
  id: string;
  title: string;
  description: string;
  secondaryLink?: { label: string; href: string };
};

export function ContactCtaBand({
  id,
  title,
  description,
  secondaryLink,
}: ContactCtaBandProps) {
  return (
    <section id={id} className="bg-brand-yellow py-16 sm:py-20">
      <div className="container-content grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-brand-ink sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-[#51440f]">{description}</p>
          {secondaryLink && (
            <a
              href={secondaryLink.href}
              className="mt-5 inline-block text-sm font-bold text-brand-ink underline-offset-4 hover:underline"
            >
              {secondaryLink.label}
            </a>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Button href={site.whatsappUrl} variant="dark">
            Écrire sur WhatsApp <span aria-hidden>↗</span>
          </Button>
          <a
            href={`tel:${site.phoneTel}`}
            className="rounded-[var(--radius-button)] border border-brand-ink/10 bg-brand-white/60 px-5 py-4 transition-colors hover:bg-brand-white"
          >
            <small className="block text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#5b4b0d]">
              Appeler ONLOUTOU
            </small>
            <strong className="font-display text-lg font-extrabold text-brand-ink">
              {site.phoneDisplay}
            </strong>
          </a>
        </div>
      </div>
    </section>
  );
}

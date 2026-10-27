import { site } from "@/content/site";
import { whatsappHref } from "@/content/whatsapp-journeys";
import { Button } from "@/components/ui/Button";

export function RequestEquipmentCta() {
  return (
    <section className="section-spacing bg-brand-charcoal text-white">
      <div className="container-content text-center lg:text-left">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Je cherche un équipement
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#cccccc] lg:mx-0">
          Décrivez votre besoin (location ou achat). ONLOUTOU qualifie la demande et confirme les
          disponibilités selon la zone et les partenaires.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
          <Button href={whatsappHref("equipmentCatalog")} variant="primary">
            Demander une disponibilité
          </Button>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex min-h-11 items-center text-sm font-bold text-brand-yellow"
          >
            {site.phoneDisplay}
          </a>
          <Button href="/contact" variant="outline" className="border-white/40 text-white hover:border-brand-yellow">
            Parler à ONLOUTOU
          </Button>
        </div>
      </div>
    </section>
  );
}

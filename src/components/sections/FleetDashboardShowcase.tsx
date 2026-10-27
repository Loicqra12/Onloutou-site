import Image from "next/image";
import { siteMedia } from "@/content/media";
import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";

const primary = siteMedia.dashboards.geolocalisationAbidjan;
const secondary = siteMedia.dashboards.supervision;

export function FleetDashboardShowcase() {
  return (
    <section className="section-spacing bg-brand-charcoal text-white" aria-labelledby="fleet-dashboard-title">
      <div className="container-content">
        <TitleReveal as="h2" id="fleet-dashboard-title" className="font-display text-3xl font-extrabold tracking-tight">
          Superviser les actifs depuis une interface unifiée
        </TitleReveal>
        <p className="mt-3 max-w-2xl text-sm text-[#cccccc]">
          Exemples d’interfaces de supervision — à adapter au périmètre et au contrat de chaque client.
        </p>
        <div className="mt-6 inline-flex rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-ink">
          Interface de démonstration
        </div>
        <p className="mt-2 text-xs text-[#aaaaaa]">
          Données, volumes et positions illustratifs — aucune donnée de flotte réelle.
        </p>
        <div className="relative mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#333333] bg-[#171717] shadow-2xl">
              <Image
                src={primary.src}
                alt={primary.alt}
                width={primary.width}
                height={primary.height}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="editorial-media__img h-auto w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#333333] bg-[#171717] shadow-2xl lg:-mt-6 lg:translate-x-2">
              <Image
                src={secondary.src}
                alt={secondary.alt}
                width={secondary.width}
                height={secondary.height}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="editorial-media__img h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { partnerHubCards } from "@/content/partners-page";
import { PartnerTypeCard } from "@/components/ui/PartnerTypeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

export function PartnersPreviewSection() {
  return (
    <section id="partenaires" className="section-spacing bg-brand-paper">
      <div className="container-content">
        <SectionHeading
          number="08"
          eyebrow="Écosystème"
          title="Partenaires et"
          titleHighlight="collaborations."
          description="Fournisseurs, logistique et technologie : trois profils pour enrichir location, vente, connectivité et projets."
        />
        <StaggerReveal className="mt-8 grid gap-4 md:grid-cols-3">
          {partnerHubCards.map((card) => (
            <PartnerTypeCard
              key={card.id}
              title={card.title}
              summary={card.summary}
              href={card.href}
              cta={card.cta}
            />
          ))}
        </StaggerReveal>
        <Link href="/partenaires" className="mt-8 inline-flex text-sm font-bold text-brand-ink hover:text-brand-yellow">
          Hub partenaires ↗
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { equipmentCategories } from "@/content/equipment";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function EquipmentPreviewSection() {
  const preview = equipmentCategories.slice(0, 4);
  return (
    <section id="equipements" className="section-spacing">
      <div className="container-content">
        <SectionHeading
          number="02"
          eyebrow="Équipements"
          title="Location et vente,"
          titleHighlight="selon votre besoin."
          description="Catégories éditoriales et demandes qualifiées — sans catalogue produit ni prix affichés en ligne."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((cat, index) => (
            <Reveal key={cat.slug} as="li" delay={index * 60} className="list-none">
              <Link
                href="/equipements"
                className="interactive-card block h-full rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-5 shadow-[var(--shadow-card)] hover:border-brand-yellow"
              >
                <span className="text-2xl" aria-hidden>{cat.icon}</span>
                <h3 className="mt-3 font-display text-lg font-extrabold">{cat.name}</h3>
                <p className="mt-2 text-xs text-brand-muted">{cat.summary}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/equipements" className="text-sm font-bold text-brand-ink hover:text-brand-yellow">
            Voir toutes les catégories ↗
          </Link>
        </div>
      </div>
    </section>
  );
}

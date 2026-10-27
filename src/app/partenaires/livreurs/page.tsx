import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { deliveryPage } from "@/content/partners-page";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceContactCta } from "@/components/ui/ServiceContactCta";

export const metadata: Metadata = createPageMetadata({ ...deliveryPage.seo, path: "/partenaires/livreurs" });

export default function PartenairesLivreursPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Partenaires", href: "/partenaires" },
          { label: "Livreurs" },
        ]}
        title={
          <>
            Partenaires <HighlightedText tone="on-dark">{deliveryPage.heroHighlight}</HighlightedText>
          </>
        }
        description={deliveryPage.intro}
        primaryCta={{ label: "WhatsApp", href: deliveryPage.whatsapp }}
      />
      <section className="section-spacing">
        <div className="container-content">
          <h2 className="font-display text-2xl font-extrabold">Missions possibles</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {deliveryPage.missions.map((mission) => (
              <li key={mission} className="rounded-[var(--radius-card)] border border-brand-border px-4 py-3 text-sm font-semibold">
                {mission}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{deliveryPage.notice}</EditorialNotice>
        </div>
      </section>
      <ServiceContactCta
        whatsappHref={deliveryPage.whatsapp}
        title="Candidature livreur"
        description="Message WhatsApp prérempli — ajustable avant envoi."
      />
    </>
  );
}

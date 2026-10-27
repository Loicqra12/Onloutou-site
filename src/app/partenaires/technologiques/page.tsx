import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { techPage } from "@/content/partners-page";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceContactCta } from "@/components/ui/ServiceContactCta";

export const metadata: Metadata = createPageMetadata({ ...techPage.seo, path: "/partenaires/technologiques" });

export default function PartenairesTechnologiquesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Partenaires", href: "/partenaires" },
          { label: "Technologiques" },
        ]}
        title={
          <>
            Partenaires <HighlightedText tone="on-dark">{techPage.heroHighlight}</HighlightedText>
          </>
        }
        description={techPage.intro}
        primaryCta={{ label: "WhatsApp", href: techPage.whatsapp }}
      />
      <section className="section-spacing">
        <div className="container-content">
          <ul className="grid gap-3 sm:grid-cols-2">
            {techPage.profiles.map((profile) => (
              <li key={profile} className="rounded-[var(--radius-card)] border border-brand-border px-4 py-3 text-sm font-semibold">
                {profile}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{techPage.notice}</EditorialNotice>
        </div>
      </section>
      <ServiceContactCta
        whatsappHref={techPage.whatsapp}
        title="Partenariat technologique"
        description="GPS, IoT, intégration ou maintenance : précisez votre proposition."
      />
    </>
  );
}

import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { supplierPage } from "@/content/partners-page";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceContactCta } from "@/components/ui/ServiceContactCta";

export const metadata: Metadata = createPageMetadata({ ...supplierPage.seo, path: "/partenaires/fournisseurs" });

export default function PartenairesFournisseursPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Partenaires", href: "/partenaires" },
          { label: "Fournisseurs" },
        ]}
        title={
          <>
            Partenaires <HighlightedText tone="on-dark">{supplierPage.heroHighlight}</HighlightedText>
          </>
        }
        description={supplierPage.intro}
        primaryCta={{ label: "WhatsApp", href: supplierPage.whatsapp }}
      />
      <section className="section-spacing">
        <div className="container-content">
          <ul className="grid gap-3 sm:grid-cols-2">
            {supplierPage.points.map((point) => (
              <li key={point} className="rounded-[var(--radius-card)] border border-brand-border px-4 py-3 text-sm font-semibold">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{supplierPage.notice}</EditorialNotice>
        </div>
      </section>
      <ServiceContactCta
        whatsappHref={supplierPage.whatsapp}
        title="Proposer des équipements"
        description="Premier échange pour comprendre votre catalogue et les modalités envisageables."
      />
    </>
  );
}

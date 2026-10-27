import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceContactCta } from "@/components/ui/ServiceContactCta";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import { SolutionCrossLinks } from "@/components/ui/SolutionCrossLinks";
import { assetSecurityContent, assetSecuritySeo } from "@/content/solutions/asset-security";

export const metadata: Metadata = createPageMetadata({ ...assetSecuritySeo, path: "/solutions/securisation-actifs" });

export default function AssetSecurityPage() {
  const c = assetSecurityContent;
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Solutions", href: "/solutions" },
          { label: "Sécurisation" },
        ]}
        title={
          <>
            Sécurisation d’<HighlightedText tone="on-dark">{c.heroHighlight}</HighlightedText>
          </>
        }
        description={c.heroDescription}
        primaryCta={{ label: "Échanger sur un dispositif", href: c.whatsapp }}
        secondaryCta={{ label: "Géolocalisation", href: "/solutions/geolocalisation" }}
      />
      <section className="section-spacing">
        <div className="container-content">
          <h2 className="font-display text-3xl font-extrabold">Capacités</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {c.capabilities.map((item) => (
              <li key={item} className="rounded-[var(--radius-card)] border border-brand-border px-4 py-3 text-sm font-semibold">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-spacing bg-brand-paper">
        <div className="container-content max-w-3xl space-y-4">
          <EditorialNotice title="Références historiques">{c.historicalNotice}</EditorialNotice>
          <EditorialNotice title="Avertissement">{c.disclaimer}</EditorialNotice>
        </div>
      </section>
      <ServiceFaq items={c.faq} />
      <ServiceContactCta whatsappHref={c.whatsapp} />
      <SolutionCrossLinks currentHref="/solutions/securisation-actifs" />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { AssetEquipmentExplorer } from "@/components/equipment/AssetEquipmentExplorer";
import { ConnectedArchitecture } from "@/components/equipment/ConnectedArchitecture";
import { ConnectedEquipmentFamilies } from "@/components/equipment/ConnectedEquipmentFamilies";
import { ConnectedEquipmentHero } from "@/components/equipment/ConnectedEquipmentHero";
import { ConnectedEquipmentRequestBuilder } from "@/components/equipment/ConnectedEquipmentRequestBuilder";
import { ConnectedQualificationBand } from "@/components/equipment/ConnectedQualificationBand";
import { ConnectedQualificationMatrix } from "@/components/equipment/ConnectedQualificationMatrix";
import { ConnectedSupervisionSection } from "@/components/equipment/ConnectedSupervisionSection";
import { InstallationStory } from "@/components/equipment/InstallationStory";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Button } from "@/components/ui/Button";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  connectedEquipmentBreadcrumbJsonLd,
  connectedEquipmentFaq,
  connectedEquipmentMedia,
  connectedEquipmentPageSeo,
  connectedEquipmentProcess,
  connectedEquipmentServiceJsonLd,
  connectedFinalCta,
  connectedTransparency,
} from "@/content/connected-equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...connectedEquipmentPageSeo,
  path: "/equipements/equipements-connectes",
  openGraphImages: [{ url: connectedEquipmentMedia.heroInstall.src, alt: connectedEquipmentMedia.heroInstall.alt }],
});

export default function EquipementsConnectesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="connected-equipment-breadcrumb-jsonld" build={connectedEquipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="connected-equipment-service-jsonld" build={connectedEquipmentServiceJsonLd} />

      <ConnectedEquipmentHero />
      <ConnectedQualificationBand />
      <ConnectedArchitecture />
      <AssetEquipmentExplorer />
      <ConnectedEquipmentFamilies />
      <InstallationStory />
      <ConnectedSupervisionSection />
      <ConnectedQualificationMatrix />

      <section className="cec-transparency section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="cec-transparency-title">
        <div className="container-content max-w-3xl">
          <h2 id="cec-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {connectedTransparency.title}
          </h2>
          <ul className="cec-transparency__list">
            {connectedTransparency.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="cec-transparency__note">{connectedTransparency.note}</p>
        </div>
      </section>

      <ProcessTimeline title="De l’actif à la supervision." phases={connectedEquipmentProcess} />

      <ConnectedEquipmentRequestBuilder />

      <ServiceFaq items={connectedEquipmentFaq} />

      <section className="cec-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="cec-final-title">
        <div className="container-content cec-final__inner">
          <p className="partners-eyebrow">{connectedFinalCta.eyebrow}</p>
          <h2 id="cec-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            {connectedFinalCta.title}
          </h2>
          <p className="cec-final__lead">{connectedFinalCta.lead}</p>
          <div className="cec-final__actions">
            <Button href={connectedFinalCta.primary.href} variant="primary">{connectedFinalCta.primary.label}</Button>
            <Link href={connectedFinalCta.secondary.href} className="cec-final__secondary link-motion">
              {connectedFinalCta.secondary.label}
            </Link>
            <Link href={connectedFinalCta.tertiary.href} className="cec-final__tertiary link-motion">
              {connectedFinalCta.tertiary.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

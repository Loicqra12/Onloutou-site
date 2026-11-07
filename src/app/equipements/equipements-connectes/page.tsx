import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { CnxBand } from "@/components/equipment/connected/CnxBand";
import { CnxProvider } from "@/components/equipment/connected/CnxContext";
import { CnxChain, CnxDevices } from "@/components/equipment/connected/CnxDevices";
import { CnxFaqSolutions } from "@/components/equipment/connected/CnxFaq";
import { CnxForm } from "@/components/equipment/connected/CnxForm";
import { CnxHero } from "@/components/equipment/connected/CnxHero";
import { CnxInfo, CnxSteps } from "@/components/equipment/connected/CnxStatic";
import {
  connectedEquipmentBreadcrumbJsonLd,
  connectedEquipmentPageSeo,
  connectedEquipmentServiceJsonLd,
} from "@/content/connected-equipment-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/connected-page.css";

export const metadata: Metadata = createPageMetadata({
  ...connectedEquipmentPageSeo,
  path: "/equipements/equipements-connectes",
});

export default function EquipementsConnectesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="connected-equipment-breadcrumb-jsonld" build={connectedEquipmentBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="connected-equipment-service-jsonld" build={connectedEquipmentServiceJsonLd} />

      <div className="cnx-page">
        <CnxProvider>
          <CnxHero />
          <CnxDevices />
          <CnxChain />
          <CnxInfo />
          <CnxSteps />
          <CnxForm />
          <CnxFaqSolutions />
          <CnxBand />
        </CnxProvider>
      </div>
    </>
  );
}

import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { BuyOrRentComparison } from "@/components/sales/BuyOrRentComparison";
import { EquipmentFamilies } from "@/components/sales/EquipmentFamilies";
import { EquipmentRequestBuilder } from "@/components/sales/EquipmentRequestBuilder";
import { SalesConfirmation } from "@/components/sales/SalesConfirmation";
import { SalesConnected } from "@/components/sales/SalesConnected";
import { SalesEnvironment } from "@/components/sales/SalesEnvironment";
import { SalesFaq } from "@/components/sales/SalesFaq";
import { SalesFinalCta } from "@/components/sales/SalesFinalCta";
import { SalesHero } from "@/components/sales/SalesHero";
import { SalesServices } from "@/components/sales/SalesServices";
import { SelectionProcess } from "@/components/sales/SelectionProcess";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import {
  salesBreadcrumbJsonLd,
  salesEditorialNotice,
  salesSeo,
  salesSelectionBand,
  salesServiceJsonLd,
} from "@/content/sales-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({ ...salesSeo, path: "/solutions/vente" });

export default function SalesPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="sales-breadcrumb-jsonld" build={salesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="sales-service-jsonld" build={salesServiceJsonLd} />

      <SalesHero />

      <section className="sales-band" aria-label="Repères de sélection">
        <div className="container-content">
          <ol className="sales-band__list">
            {salesSelectionBand.map((label, index) => (
              <Reveal key={label} delay={index * 40} as="li" className="sales-band__item">
                <span className="sales-band__num">{String(index + 1).padStart(2, "0")}</span>
                <span className="sales-band__line" aria-hidden />
                <span>{label}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <EquipmentFamilies />
      <BuyOrRentComparison />
      <SalesEnvironment />
      <SalesConnected />
      <SelectionProcess />
      <SalesServices />
      <EquipmentRequestBuilder />
      <SalesConfirmation />
      <SalesFaq />

      <section className="sales-notice">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{salesEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <SalesFinalCta />
    </>
  );
}

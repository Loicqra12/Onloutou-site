import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { EquipmentRequestBuilder } from "@/components/sales/EquipmentRequestBuilder";
import { SalesAdvice } from "@/components/sales/SalesAdvice";
import { SalesConfirmation } from "@/components/sales/SalesConfirmation";
import { SalesFaq } from "@/components/sales/SalesFaq";
import { SalesFinalCta } from "@/components/sales/SalesFinalCta";
import { SalesHero } from "@/components/sales/SalesHero";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { salesBreadcrumbJsonLd, salesEditorialNotice, salesSeo, salesServiceJsonLd } from "@/content/sales-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/commerce-pages.css";

export const metadata = createPageMetadata({ ...salesSeo, path: "/solutions/vente" });

export default function SalesPage() {
  return (
    <div className="cm-page">
      <JsonLdFromSiteUrl id="sales-breadcrumb-jsonld" build={salesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="sales-service-jsonld" build={salesServiceJsonLd} />

      <SalesHero />
      <SalesAdvice />
      <EquipmentRequestBuilder />
      <SalesConfirmation />
      <SalesFaq />

      <section className="sales-notice">
        <div className="cm-wrap">
          <EditorialNotice>{salesEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <SalesFinalCta />
    </div>
  );
}

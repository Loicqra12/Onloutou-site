import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { RentalCatalogOriginsBand } from "@/components/rental/RentalCatalogOriginsBand";
import { RentalBriefBuilder } from "@/components/rental/RentalBriefBuilder";
import { RentalCategories } from "@/components/rental/RentalCategories";
import { RentalFaq } from "@/components/rental/RentalFaq";
import { RentalFinalCta } from "@/components/rental/RentalFinalCta";
import { RentalHero } from "@/components/rental/RentalHero";
import { RentalNeedBand } from "@/components/rental/RentalNeedBand";
import { RentalProcess } from "@/components/rental/RentalProcess";
import { RentalTransparency } from "@/components/rental/RentalTransparency";
import { RentalUseCases } from "@/components/rental/RentalUseCases";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import {
  rentalBreadcrumbJsonLd,
  rentalEditorialNotice,
  rentalSeo,
  rentalServiceJsonLd,
} from "@/content/rental-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({ ...rentalSeo, path: "/solutions/location" });

export default function RentalPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="rental-breadcrumb-jsonld" build={rentalBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="rental-service-jsonld" build={rentalServiceJsonLd} />

      <RentalHero />
      <RentalNeedBand />
      <RentalCategories />
      <RentalUseCases />
      <RentalProcess />
      <RentalCatalogOriginsBand />
      <RentalBriefBuilder />
      <RentalTransparency />
      <RentalFaq />

      <section className="rental-notice">
        <div className="container-content max-w-3xl">
          <EditorialNotice>{rentalEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <RentalFinalCta />
    </>
  );
}

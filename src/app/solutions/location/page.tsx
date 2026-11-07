import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { RentalBriefBuilder } from "@/components/rental/RentalBriefBuilder";
import { RentalFaq } from "@/components/rental/RentalFaq";
import { RentalFinalCta } from "@/components/rental/RentalFinalCta";
import { RentalHero } from "@/components/rental/RentalHero";
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
import "@/styles/commerce-pages.css";

export const metadata = createPageMetadata({ ...rentalSeo, path: "/solutions/location" });

export default function RentalPage() {
  return (
    <div className="cm-page">
      <JsonLdFromSiteUrl id="rental-breadcrumb-jsonld" build={rentalBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="rental-service-jsonld" build={rentalServiceJsonLd} />

      <RentalHero />
      <RentalUseCases />
      <RentalProcess />
      <RentalBriefBuilder />
      <RentalTransparency />
      <RentalFaq />

      <section className="rental-notice">
        <div className="cm-wrap">
          <EditorialNotice>{rentalEditorialNotice}</EditorialNotice>
        </div>
      </section>

      <RentalFinalCta />
    </div>
  );
}

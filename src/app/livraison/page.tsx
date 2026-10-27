import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { DeliveryAudienceSwitch } from "@/components/delivery/DeliveryAudienceSwitch";
import { DeliveryDigitalSection } from "@/components/delivery/DeliveryDigitalSection";
import { DeliveryFinalCta } from "@/components/delivery/DeliveryFinalCta";
import { DeliveryHero } from "@/components/delivery/DeliveryHero";
import { DeliveryJourney } from "@/components/delivery/DeliveryJourney";
import { DeliveryLogisticsSection } from "@/components/delivery/DeliveryLogisticsSection";
import { DeliveryNeedsSection } from "@/components/delivery/DeliveryNeedsSection";
import { DeliveryRequestBuilder } from "@/components/delivery/DeliveryRequestBuilder";
import { DeliveryRouteBand } from "@/components/delivery/DeliveryRouteBand";
import { DeliverySafetySection } from "@/components/delivery/DeliverySafetySection";
import { DeliveryTransparencySection } from "@/components/delivery/DeliveryTransparencySection";
import { DeliveryDriverTeaser } from "@/components/delivery/DeliveryDriverTeaser";
import { TransportSelector } from "@/components/delivery/TransportSelector";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  deliveryBreadcrumbJsonLd,
  deliveryFaq,
  deliveryPageMedia,
  deliveryPageSeo,
  deliveryServiceJsonLd,
} from "@/content/delivery-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...deliveryPageSeo,
  path: "/livraison",
  openGraphImages: [{ url: deliveryPageMedia.hero.src, alt: deliveryPageMedia.hero.alt }],
});

export default function LivraisonPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="delivery-breadcrumb-jsonld" build={deliveryBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="delivery-service-jsonld" build={deliveryServiceJsonLd} />
      <DeliveryHero />
      <DeliveryRouteBand />
      <DeliveryAudienceSwitch />
      <DeliveryNeedsSection />
      <DeliveryJourney />
      <DeliveryLogisticsSection />
      <TransportSelector />
      <DeliveryDigitalSection />
      <DeliverySafetySection />
      <DeliveryDriverTeaser />
      <DeliveryRequestBuilder />
      <DeliveryTransparencySection />
      <ServiceFaq items={deliveryFaq} />
      <DeliveryFinalCta />
    </>
  );
}

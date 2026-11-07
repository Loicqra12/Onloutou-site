import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { PtnDeliveryForm } from "@/components/partners/redesign/PtnDeliveryForm";
import { PtnDrvChoices, PtnDrvHero, PtnDrvSteps } from "@/components/partners/redesign/PtnDelivery";
import { PtnFaq } from "@/components/partners/redesign/PtnFaq";
import {
  deliveryBreadcrumbJsonLd,
  deliveryPageMedia,
  deliveryPageSeo,
  deliveryServiceJsonLd,
} from "@/content/delivery-page";
import { ptnDrvFaq } from "@/content/partners-subpages";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/partners-redesign.css";
import "@/styles/partners-subpages.css";

export const metadata: Metadata = createPageMetadata({
  ...deliveryPageSeo,
  path: "/livraison",
  openGraphImages: [{ url: deliveryPageMedia.hero.src, alt: deliveryPageMedia.hero.alt }],
});

export default function LivraisonPage() {
  return (
    <div className="ptn-page">
      <PageReveal root=".ptn-page" targets=".ptn-tiles__grid > li, .ptn-cards > li, .ptn-steps > li, .ptn-sup-grid > li" />
      <JsonLdFromSiteUrl id="delivery-breadcrumb-jsonld" build={deliveryBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="delivery-service-jsonld" build={deliveryServiceJsonLd} />
      <PtnDrvHero />
      <PtnDrvChoices id="devenir-livreur" />
      <PtnDeliveryForm />
      <PtnDrvSteps id="fonctionnement-livraison" />
      <PtnFaq content={ptnDrvFaq} variant="cards" initialOpen={0} />
    </div>
  );
}
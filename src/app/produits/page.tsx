import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { ProductAccessComparison } from "@/components/products/ProductAccessComparison";
import { ProductDeliveryTeaser } from "@/components/products/ProductDeliveryTeaser";
import { ProductFamilyShowcase } from "@/components/products/ProductFamilyShowcase";
import { ProductQualitySection } from "@/components/products/ProductQualitySection";
import { ProductSourcingSection } from "@/components/products/ProductSourcingSection";
import { ProductTransparencySection } from "@/components/products/ProductTransparencySection";
import { ProductsCatalogFuture } from "@/components/products/ProductsCatalogFuture";
import { ProductsFinalCta } from "@/components/products/ProductsFinalCta";
import { ProductsHero } from "@/components/products/ProductsHero";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { ServiceFaq } from "@/components/ui/ServiceFaq";
import {
  productsBreadcrumbJsonLd,
  productsCollectionJsonLd,
  productsCommercialProcess,
  productsFaq,
  productsPageMedia,
  productsPageSeo,
  productsPositioningNote,
} from "@/content/products-page";
import { createPageMetadata } from "@/lib/seo/metadata";

const ProductIntentRail = dynamic(() =>
  import("@/components/products/ProductIntentRail").then((m) => m.ProductIntentRail),
);
const ProductUseExplorer = dynamic(() =>
  import("@/components/products/ProductUseExplorer").then((m) => m.ProductUseExplorer),
);
const ProductRequestBuilder = dynamic(() =>
  import("@/components/products/ProductRequestBuilder").then((m) => m.ProductRequestBuilder),
);

export const metadata: Metadata = createPageMetadata({
  ...productsPageSeo,
  path: "/produits",
  openGraphImages: [{ url: productsPageMedia.heroPrimary.src, alt: productsPageMedia.heroPrimary.alt }],
});

export default function ProduitsPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="products-breadcrumb-jsonld" build={productsBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="products-collection-jsonld" build={productsCollectionJsonLd} />
      <ProductsHero />
      <ProductIntentRail />
      <div className="container-content section-spacing pt-0">
        <EditorialNotice>{productsPositioningNote}</EditorialNotice>
      </div>
      <ProductFamilyShowcase />
      <ProductUseExplorer />
      <ProductAccessComparison />
      <ProductSourcingSection />
      <ProductQualitySection />
      <ProcessTimeline
        id="processus-commercial"
        title="De votre besoin à une proposition confirmée."
        phases={productsCommercialProcess}
      />
      <ProductsCatalogFuture />
      <ProductRequestBuilder />
      <ProductTransparencySection />
      <ProductDeliveryTeaser />
      <ServiceFaq items={productsFaq} />
      <ProductsFinalCta />
    </>
  );
}

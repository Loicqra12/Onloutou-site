import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { RecHub } from "@/components/reception/RecHub";
import { REC_ROOT, recBreadcrumbJsonLd, recCollectionJsonLd, recHubSeo } from "@/content/reception";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...recHubSeo,
  path: REC_ROOT,
});

export default function ReceptionPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-breadcrumb-jsonld"
        build={(base) =>
          recBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: "Reception & téléphonie", path: REC_ROOT },
          ])
        }
      />
      <JsonLdFromSiteUrl id="mob-collection-jsonld" build={recCollectionJsonLd} />
      <RecHub />
    </>
  );
}
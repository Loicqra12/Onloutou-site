import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { InfHub } from "@/components/informatique/InfHub";
import { INF_ROOT, infBreadcrumbJsonLd, infCollectionJsonLd, infHubSeo } from "@/content/informatique";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...infHubSeo,
  path: INF_ROOT,
});

export default function InformatiquePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="inf-breadcrumb-jsonld"
        build={(base) =>
          infBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: "Informatique & téléphonie", path: INF_ROOT },
          ])
        }
      />
      <JsonLdFromSiteUrl id="inf-collection-jsonld" build={infCollectionJsonLd} />
      <InfHub />
    </>
  );
}
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { EnfHub } from "@/components/enfance/EnfHub";
import { ENF_ROOT, enfBreadcrumbJsonLd, enfCollectionJsonLd, enfHubSeo } from "@/content/enfance";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...enfHubSeo,
  path: ENF_ROOT,
});

export default function EnfancePage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="enf-breadcrumb-jsonld"
        build={(base) =>
          enfBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: "Bébé & enfance", path: ENF_ROOT },
          ])
        }
      />
      <JsonLdFromSiteUrl id="enf-collection-jsonld" build={enfCollectionJsonLd} />
      <EnfHub />
    </>
  );
}

import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { ElmHub } from "@/components/electromenager/ElmHub";
import { ELM_ROOT, elmBreadcrumbJsonLd, elmCollectionJsonLd, elmHubSeo } from "@/content/electromenager";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...elmHubSeo,
  path: ELM_ROOT,
});

export default function ElectromenagerPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="elm-breadcrumb-jsonld"
        build={(base) =>
          elmBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: "Électroménager", path: ELM_ROOT },
          ])
        }
      />
      <JsonLdFromSiteUrl id="elm-collection-jsonld" build={elmCollectionJsonLd} />
      <ElmHub />
    </>
  );
}

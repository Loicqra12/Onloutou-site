import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { MobHub } from "@/components/mobilier/MobHub";
import { MOB_ROOT, mobBreadcrumbJsonLd, mobCollectionJsonLd, mobHubSeo } from "@/content/mobilier";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  ...mobHubSeo,
  path: MOB_ROOT,
});

export default function MobilierPage() {
  return (
    <>
      <JsonLdFromSiteUrl
        id="mob-breadcrumb-jsonld"
        build={(base) =>
          mobBreadcrumbJsonLd(base, [
            { name: "Accueil", path: "/" },
            { name: "Mobilier & téléphonie", path: MOB_ROOT },
          ])
        }
      />
      <JsonLdFromSiteUrl id="mob-collection-jsonld" build={mobCollectionJsonLd} />
      <MobHub />
    </>
  );
}
import type { Metadata } from "next";
import { JsonLdFromSiteUrl } from "@/components/seo/JsonLd";
import { MopBand } from "@/components/motorcycles/redesign/MopBand";
import { MopProvider } from "@/components/motorcycles/redesign/MopContext";
import { MopFaq } from "@/components/motorcycles/redesign/MopFaq";
import { MopForm } from "@/components/motorcycles/redesign/MopForm";
import { MopHero } from "@/components/motorcycles/redesign/MopHero";
import { MopDaily, MopProfiles } from "@/components/motorcycles/redesign/MopProfiles";
import { MopPrep, MopProposal } from "@/components/motorcycles/redesign/MopStatic";
import { motorcyclesBreadcrumbJsonLd, motorcyclesPageSeo, motorcyclesServiceJsonLd } from "@/content/motorcycles-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/motorcycles-page.css";

export const metadata: Metadata = createPageMetadata({
  ...motorcyclesPageSeo,
  path: "/equipements/motos",
});

export default function MotosPage() {
  return (
    <>
      <JsonLdFromSiteUrl id="motorcycles-breadcrumb-jsonld" build={motorcyclesBreadcrumbJsonLd} />
      <JsonLdFromSiteUrl id="motorcycles-service-jsonld" build={motorcyclesServiceJsonLd} />

      <div className="mop-page">
        <MopProvider>
          <MopHero />
          <MopProfiles />
          <MopDaily />
          <MopPrep />
          <MopForm />
          <MopProposal />
          <MopFaq />
          <MopBand />
        </MopProvider>
      </div>
    </>
  );
}

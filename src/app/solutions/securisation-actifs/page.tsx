import { PageReveal } from "@/components/motion/PageReveal";
import type { Metadata } from "next";
import { SecFaq } from "@/components/security/redesign/SecFaq";
import { SecHero } from "@/components/security/redesign/SecHero";
import {
  SecCta,
  SecDevice,
  SecExplore,
  SecFrame,
  SecReferences,
} from "@/components/security/redesign/SecSections";
import { assetSecuritySeo } from "@/content/solutions/asset-security";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/security-page.css";

export const metadata: Metadata = createPageMetadata({ ...assetSecuritySeo, path: "/solutions/securisation-actifs" });

export default function AssetSecurityPage() {
  return (
    <div className="sec-page">
      <PageReveal root=".sec-page" targets=".sec-device__grid > li, .sec-explore__list > li" />
      <SecHero />
      <SecDevice />
      <SecFrame />
      <SecReferences />
      <SecFaq />
      <SecCta />
      <SecExplore />
    </div>
  );
}

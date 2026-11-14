import type { Metadata } from "next";
import { DpLanding } from "@/components/partners/DpLanding";
import { dpLandingSeo } from "@/content/devenir-partenaire";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/devenir-partenaire.css";

export const metadata: Metadata = createPageMetadata({
  ...dpLandingSeo,
  path: "/devenir-partenaire",
});

export default function DevenirPartenairePage() {
  return <DpLanding />;
}

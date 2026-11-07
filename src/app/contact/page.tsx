import type { Metadata } from "next";
import { CtcForm } from "@/components/contact/redesign/CtcForm";
import { CtcBand, CtcCards, CtcClaims, CtcDirect, CtcHero, CtcPrecisions } from "@/components/contact/redesign/CtcSections";
import { contactSeo } from "@/content/contact-page";
import { createPageMetadata } from "@/lib/seo/metadata";
import "@/styles/contact-redesign.css";

export const metadata: Metadata = createPageMetadata({ ...contactSeo, path: "/contact" });

export default function ContactPage() {
  return (
    <div className="ctc-page">
      <CtcHero />
      <div className="ctc-grid">
        <CtcDirect />
        <CtcForm />
      </div>
      <CtcPrecisions />
      <CtcClaims />
      <CtcCards />
      <CtcBand />
    </div>
  );
}
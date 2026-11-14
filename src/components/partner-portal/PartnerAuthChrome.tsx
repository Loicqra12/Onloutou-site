import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { dpAuth } from "@/content/devenir-partenaire";
import "@/styles/partner-auth.css";

export function PartnerAuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="pa-page">
      <div className="pa-bar">
        <BrandLogo theme="dark" />
        <Link href="/" className="pa-bar__back">← {dpAuth.back}</Link>
      </div>
      {children}
    </div>
  );
}

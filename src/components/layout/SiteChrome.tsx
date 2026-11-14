"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DpMiniFooter } from "@/components/partners/DpMiniFooter";
import { isPartnerMinimalChrome } from "@/lib/partner-chrome";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const minimal = isPartnerMinimalChrome(pathname);
  const partnerLanding = pathname === "/devenir-partenaire" || pathname.startsWith("/devenir-partenaire/");
  return (
    <>
      {minimal ? null : <SiteHeader />}
      <main id="contenu-principal">{children}</main>
      {minimal ? null : partnerLanding ? <DpMiniFooter /> : <SiteFooter />}
    </>
  );
}

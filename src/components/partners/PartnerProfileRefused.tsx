"use client";

import Link from "next/link";
import { dpPaths, dpSpace } from "@/content/devenir-partenaire";
import { ppCopy } from "@/content/partner-profile-wizard";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaSect } from "@/components/partners/PaField";
import "@/styles/partner-articles.css";

export function PartnerProfileRefused({
  name,
  reason,
}: {
  name: string;
  reason?: string | null;
}) {
  const t = ppCopy.refused;
  return (
    <div className="pa pa-main-pad">
      <div className="pa-head">
        <div>
          <h1>{t.title}</h1>
          <p>{t.lead.replace("{name}", name)}</p>
        </div>
        <span className="pa-badge pa-badge--closed"><DpIcon name="xCircle" /> {t.badge}</span>
      </div>

      <div className="pa-grid">
        <section className="pa-card">
          <PaSect icon="info">{t.reasonTitle}</PaSect>
          <p className="pa-callout pa-callout--panel" style={{ margin: 0 }}>
            <DpIcon name="chat" />
            <span>{reason?.trim() || t.reasonFallback}</span>
          </p>
          <p className="pa-hint" style={{ marginTop: "0.75rem" }}>
            <DpIcon name="lock" /> Aucun article ne sera publié tant que le profil n’est pas approuvé.
          </p>
        </section>
        <aside className="pa-aside">
          <PaSect>{t.nextTitle}</PaSect>
          <ul className="pa-how">
            {t.next.map((item) => (
              <li key={item.text}>
                <span className="pa-how__icon"><DpIcon name={item.icon} /></span>
                <div>{item.text}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={dpSpace.contactHref} className="pa-btn"><DpIcon name="mail" /> {t.contact}</Link>
          <Link href={`${dpPaths.account}?etape=informations`} className="pa-btn pa-btn--yellow">{t.cta} →</Link>
        </div>
      </div>
    </div>
  );
}

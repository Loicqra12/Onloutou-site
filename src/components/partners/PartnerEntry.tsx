"use client";

import Link from "next/link";
import { dpEntry } from "@/content/devenir-partenaire";
import { DpPicture } from "@/components/partners/DpPicture";
import { usePartnerSession } from "@/components/partners/usePartnerSession";
import "@/styles/devenir-partenaire.css";

export function PartnerEntry() {
  const { loggedIn, ready } = usePartnerSession();
  return (
    <div className="dp-page">
      <div className="dp-wrap">
        <section className="dp-hero" aria-labelledby="dp-entry-title">
          <div>
            <p className="dp-badge">{dpEntry.badge}</p>
            <h1 id="dp-entry-title" className="dp-h1">{dpEntry.title}</h1>
            <p className="dp-lead">{dpEntry.lead}</p>
            <div className="dp-hero__actions">
              {ready && loggedIn ? (
                <Link href={dpEntry.access.href} className="dp-btn dp-btn--yellow">{dpEntry.access.label}</Link>
              ) : (
                <>
                  <Link href={dpEntry.create.href} className="dp-btn dp-btn--yellow">{dpEntry.create.label}</Link>
                  <Link href={dpEntry.login.href} className="dp-btn dp-btn--ghost">{dpEntry.login.label}</Link>
                </>
              )}
            </div>
          </div>
          <DpPicture image={dpEntry.image} className="dp-hero__visual" sizes="(max-width: 900px) 100vw, 50vw" priority />
        </section>
      </div>
    </div>
  );
}

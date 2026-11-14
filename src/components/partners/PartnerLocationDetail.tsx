"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { plCopy } from "@/content/partner-locations";
import { paCopy, paPaths } from "@/content/partner-articles";
import { pdPaths } from "@/content/partner-demands";
import { prPaths } from "@/content/partner-revenues";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaSect } from "@/components/partners/PaField";
import { formatFrRange, unitWord } from "@/lib/partner-articles";
import { locationStatusLabel, locationStepIndex, type PartnerLocation } from "@/lib/partner-ops";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

export function PartnerLocationDetail({ locationId }: { locationId: string }) {
  const t = plCopy.detail;
  const [row, setRow] = useState<PartnerLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ location: PartnerLocation }>(`/partner/locations/${locationId}`);
      if (!res.ok) { setError(res.error); return; }
      setRow(res.data.location);
    })();
  }, [locationId]);

  if (error) return <p className="pa-error" role="alert">{error}</p>;
  if (!row) return <p>{paCopy.loading}</p>;

  const current = locationStepIndex(row.status);
  const unit = unitWord(row.product.terms.rentalMode, row.quantity);

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={paPaths.locations}>{t.crumb}</Link>
        {" / "}
        <strong>{row.reference}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{t.title}</h1>
        </div>
        <span className="pa-badge pa-badge--ok"><DpIcon name="check" /> {locationStatusLabel(row.status)}</span>
      </div>

      <div className="pa-grid">
        <section className="pa-card">
          <div className="pa-recap-article">
            <div className="pa-draft-preview__photo">
              {row.product.imageUrl ? <img src={row.product.imageUrl} alt="" /> : <DpIcon name="camera" />}
            </div>
            <div>
              <h2>{row.product.title}</h2>
              <p className="pd-ref"><DpIcon name="list" /> {t.ref.replace("{ref}", row.reference)}</p>
              <p className="pd-ref"><DpIcon name="doc" /> {t.demand} {row.demand.reference}</p>
              <table className="pa-recap">
                <tbody>
                  <tr><th><DpIcon name="layers" /> {t.qty}</th><td>{row.quantity} {unit}</td></tr>
                  <tr><th><DpIcon name="calendar" /> {t.period}</th><td>{formatFrRange(row.startDate, row.endDate)}</td></tr>
                  <tr><th><DpIcon name="pin" /> {t.commune}</th><td>{row.commune}</td></tr>
                  <tr><th><DpIcon name="van" /> {t.delivery}</th><td>{row.delivery || "—"}{row.fees ? `, ${row.fees.toLowerCase()}` : ""}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {row.onloutouNote ? (
            <p className="pa-callout pa-callout--ok" style={{ marginTop: "0.75rem" }}>
              <DpIcon name="chat" />
              <span><strong>{t.noteTitle}</strong><br />{row.onloutouNote}</span>
            </p>
          ) : null}
          {row.addressNote ? (
            <p className="pa-callout pa-callout--info" style={{ marginTop: "0.55rem" }}>
              <DpIcon name="pin" />
              <span><strong>{t.address}</strong><br />{row.addressNote}</span>
            </p>
          ) : null}
        </section>

        <aside>
          <section className="pa-aside">
            <PaSect>{t.stepsTitle}</PaSect>
            <ul className="pa-how">
              {t.steps.map((step, i) => (
                <li key={step.id}>
                  <span className={`pa-how__icon${i <= current ? "" : " is-off"}`}><DpIcon name={i < current ? "check" : i === current ? "hourglass" : "list"} /></span>
                  <div>
                    <strong>{step.title}</strong>
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.88rem" }}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <p className="pa-callout pa-callout--info" style={{ marginTop: "0.75rem" }}>
        <DpIcon name="info" />
        <span>
          <strong>{t.stockTitle}</strong><br />
          {t.stockText}{" "}
          <Link href={paPaths.article(row.product.id)} className="pa-link">{t.editStock}</Link>
        </span>
      </p>

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={paPaths.locations} className="pa-btn">← {t.back}</Link>
          {row.revenue ? (
            <Link href={prPaths.detail(row.revenue.id)} className="pa-btn pa-btn--yellow">{t.seeRevenue} →</Link>
          ) : null}
          <Link href={pdPaths.detail(row.demand.id)} className="pa-btn">{t.seeDemand}</Link>
          <Link href={paPaths.article(row.product.id)} className="pa-btn"><DpIcon name="eye" /> {t.seeArticle}</Link>
          <p className="pd-help" style={{ marginLeft: "auto" }}>
            <DpIcon name="help" /> {t.help}<br />
            <Link href={pdPaths.contact} className="pa-link"><DpIcon name="mail" /> {t.contact}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

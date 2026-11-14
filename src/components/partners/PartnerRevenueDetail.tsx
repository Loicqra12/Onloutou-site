"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { prCopy, prPaths } from "@/content/partner-revenues";
import { paCopy } from "@/content/partner-articles";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaSect } from "@/components/partners/PaField";
import { formatFrRange, unitWord } from "@/lib/partner-articles";
import {
  formatFcfa,
  formatRate,
  payoutMethodLabel,
  type PartnerRevenue,
} from "@/lib/partner-revenues";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

export function PartnerRevenueDetail({ revenueId }: { revenueId: string }) {
  const t = prCopy.detail;
  const [row, setRow] = useState<PartnerRevenue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ revenue: PartnerRevenue }>(`/partner/revenues/${revenueId}`);
      if (!res.ok) { setError(res.error); return; }
      setRow(res.data.revenue);
    })();
  }, [revenueId]);

  if (error) return <p className="pa-error" role="alert">{error}</p>;
  if (!row) return <p>{paCopy.loading}</p>;

  const paid = row.status === "PAID";
  const unit = unitWord(row.product.terms.rentalMode, row.location.quantity);

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={prPaths.list}>{t.crumb}</Link>
        {" / "}
        <strong>{row.reference}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
        <span className={`pa-badge ${paid ? "pa-badge--ok" : "pa-badge--sent"}`}>
          <DpIcon name={paid ? "check" : "hourglass"} /> {paid ? t.badgePaid : t.badgePending}
        </span>
      </div>

      <div className="pa-grid">
        <section className="pa-card">
          <PaSect icon="coins">{t.calcTitle}</PaSect>
          <ul className="pa-money">
            <li>
              <span>{t.gross}</span>
              <strong>{formatFcfa(row.grossAmount)}</strong>
            </li>
            <li>
              <span>{t.rate}</span>
              <strong>{formatRate(row.commissionBps)}</strong>
            </li>
            <li>
              <span>{t.commission}</span>
              <strong>− {formatFcfa(row.commissionAmount)}</strong>
            </li>
            <li className="is-net">
              <span>{t.net}</span>
              <strong>{formatFcfa(row.netAmount)}</strong>
            </li>
          </ul>
        </section>

        <aside>
          <section className="pa-aside">
            <PaSect icon="calendar">{t.locationTitle}</PaSect>
            <div className="pa-draft-preview__photo" style={{ marginBottom: "0.65rem" }}>
              {row.product.imageUrl ? <img src={row.product.imageUrl} alt="" /> : <DpIcon name="camera" />}
            </div>
            <h3 style={{ margin: "0 0 0.35rem" }}>{row.product.title}</h3>
            <p className="pd-ref"><DpIcon name="list" /> {t.ref.replace("{ref}", row.location.reference)}</p>
            <table className="pa-recap">
              <tbody>
                <tr><th><DpIcon name="layers" /> {t.qty}</th><td>{row.location.quantity} {unit}</td></tr>
                <tr><th><DpIcon name="calendar" /> {t.period}</th><td>{formatFrRange(row.location.startDate, row.location.endDate)}</td></tr>
                <tr><th><DpIcon name="pin" /> {t.commune}</th><td>{row.location.commune}</td></tr>
              </tbody>
            </table>
          </section>
          <section className="pa-aside" style={{ marginTop: "0.65rem" }}>
            <PaSect icon="send">{t.payoutTitle}</PaSect>
            {row.payout ? (
              <table className="pa-recap">
                <tbody>
                  <tr><th>{t.payoutRef.replace("{ref}", row.payout.reference)}</th><td>{formatFcfa(row.payout.amount)}</td></tr>
                  <tr><th>{t.payoutDate}</th><td>{new Date(row.payout.paidAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
                  <tr><th>{t.payoutMethod}</th><td>{payoutMethodLabel(row.payout.method)}</td></tr>
                  {row.payout.note ? <tr><th>{t.payoutNote}</th><td>{row.payout.note}</td></tr> : null}
                </tbody>
              </table>
            ) : (
              <p className="pa-hint" style={{ margin: 0 }}><DpIcon name="info" /> {t.payoutPending}</p>
            )}
          </section>
        </aside>
      </div>

      <p className="pa-callout pa-callout--info" style={{ marginTop: "0.75rem" }}>
        <DpIcon name="lock" /> {t.noClient}
      </p>

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={prPaths.list} className="pa-btn">← {t.back}</Link>
          <Link href={prPaths.location(row.location.id)} className="pa-btn pa-btn--yellow">{t.seeLocation} →</Link>
          <p className="pd-help" style={{ marginLeft: "auto" }}>
            <DpIcon name="help" /> {t.help}<br />
            <Link href={prPaths.contact} className="pa-link"><DpIcon name="mail" /> {t.contact}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

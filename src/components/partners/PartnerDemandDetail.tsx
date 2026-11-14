"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { pdCopy, pdPaths } from "@/content/partner-demands";
import { DpIcon, type DpIconName } from "@/components/partners/DpIcon";
import { PaSect } from "@/components/partners/PaField";
import { formatFrRange, formatPrice, unitWord } from "@/lib/partner-articles";
import { paCopy, paPaths } from "@/content/partner-articles";
import { canEditDemandReply, clarifyIcons, demandDeliveryLine, demandStatusLabel, type PartnerDemand } from "@/lib/partner-demands";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

function minLabel(value?: string | null) {
  if (value === "1_WEEK") return "1 semaine";
  if (value === "1_DAY") return "1 jour";
  if (value === "1_MONTH") return "1 mois";
  return value || "—";
}

export function PartnerDemandDetail({ demandId }: { demandId: string }) {
  const [demand, setDemand] = useState<PartnerDemand | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ demand: PartnerDemand }>(`/partner/demands/${demandId}`);
      if (!res.ok) { setError(res.error); return; }
      setDemand(res.data.demand);
    })();
  }, [demandId]);

  if (error) return <p className="pa-error" role="alert">{error}</p>;
  if (!demand) return <p>{paCopy.loading}</p>;

  if (demand.status !== "PENDING") {
    return <DemandSent demand={demand} />;
  }

  const t = pdCopy.detail;
  const unit = unitWord(demand.product.terms.rentalMode, demand.stock.available);
  const reqUnit = unitWord(demand.product.terms.rentalMode, demand.requestedQty);
  const name = demand.product.title.replace(/^\s*/, "");

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={pdPaths.list}>{t.crumb}</Link>
        {" / "}
        <strong>{demand.reference}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{t.title.replace("{name}", name.toLowerCase().includes("réfrigérateur") || name.toLowerCase().includes("refrigerateur") ? "réfrigérateur" : name)}</h1>
        </div>
        <span className="pa-badge"><DpIcon name="hourglass" /> {demandStatusLabel(demand.status)}</span>
      </div>

      <div className="pa-grid">
        <section className="pa-card">
          <div className="pa-recap-article">
            <div className="pa-draft-preview__photo">
              {demand.product.imageUrl ? <img src={demand.product.imageUrl} alt="" /> : <DpIcon name="camera" />}
            </div>
            <div>
              <h2>{demand.product.title}</h2>
              <p className="pd-ref"><DpIcon name="list" /> {t.ref.replace("{ref}", demand.reference)}</p>
              <table className="pa-recap">
                <tbody>
                  <tr><th><DpIcon name="layers" /> {t.qty}</th><td>{demand.requestedQty} {reqUnit}</td></tr>
                  <tr><th><DpIcon name="calendar" /> {t.period}</th><td>{formatFrRange(demand.startDate, demand.endDate)}</td></tr>
                  <tr><th><DpIcon name="pin" /> {t.commune}</th><td>{demand.commune}</td></tr>
                  <tr><th><DpIcon name="van" /> {t.service}</th><td>{demand.deliveryRequested ? t.delivery : "—"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {demand.brief ? (
            <p className="pa-callout pa-callout--ok" style={{ marginTop: "0.75rem" }}>
              <DpIcon name="chat" />
              <span><strong>{t.briefTitle}</strong><br />{demand.brief}</span>
            </p>
          ) : null}
        </section>

        <aside>
          <section className="pa-aside">
            <PaSect>{t.stockTitle}</PaSect>
            <div className="pa-stock pa-stock--3">
              <div className="pa-stock__tile"><strong>{demand.stock.total}</strong><span><DpIcon name="layers" /> {t.total}</span></div>
              <div className="pa-stock__tile pa-stock__tile--warn"><strong>{demand.stock.unavailable}</strong><span><DpIcon name="xCircle" /> {t.unavailable}</span></div>
              <div className="pa-stock__tile pa-stock__tile--ok"><strong>{demand.stock.available}</strong><span><DpIcon name="check" /> {t.available}</span></div>
            </div>
            <p className="pa-callout pa-callout--info" style={{ marginTop: "0.65rem" }}>
              <DpIcon name="info" /> {t.canOffer.replace("{n}", String(demand.stock.available)).replace("{unit}", unit).replace("{req}", String(demand.requestedQty))}
            </p>
            <Link href={paPaths.article(demand.product.id)} className="pa-link">{t.seeUnavail} ›</Link>
          </section>
          <p className="pa-callout pa-callout--panel" style={{ marginTop: "0.65rem" }}><DpIcon name="info" /> {t.replyNote}</p>
        </aside>
      </div>

      {demand.toClarify.length ? (
        <section className="pa-card" style={{ marginTop: "0.75rem" }}>
          <PaSect icon="gear">{t.clarify}</PaSect>
          <div className="pd-clarify">
            {demand.toClarify.map((label, i) => (
              <span key={label}><DpIcon name={(clarifyIcons[i] ?? "info") as DpIconName} /> {label}</span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={pdPaths.list} className="pa-btn">← {t.back}</Link>
          <p className="pa-hint" style={{ margin: 0 }}><DpIcon name="info" /> {t.noneReserved}</p>
          <Link href={pdPaths.reply(demand.id)} className="pa-btn pa-btn--yellow">{t.prepare} →</Link>
        </div>
      </div>
    </div>
  );
}

function DemandSent({ demand }: { demand: PartnerDemand }) {
  const t = pdCopy.sent;
  const selected = demand.outcome === "SELECTED";
  const declined = demand.outcome === "DECLINED" || demand.outcome === "CANCELLED" || demand.outcome === "EXPIRED";
  const title = selected ? t.selectedTitle : demand.outcome === "CANCELLED" ? t.cancelledTitle : declined ? t.declinedTitle : t.title;
  const lead = selected ? t.selectedLead : demand.outcome === "CANCELLED" ? t.cancelledLead : declined ? t.declinedLead : t.lead;
  const badge = selected ? t.selectedBadge : demand.outcome === "CANCELLED" ? t.cancelledBadge : declined ? t.declinedBadge : t.badge;
  const next = selected ? t.selectedNext : declined ? t.declinedNext : demand.replyKind === "AVAILABLE" ? t.nextAvailable : t.next;
  const chip = demand.replyKind === "ADJUSTMENT" ? t.adjust : demand.replyKind === "UNAVAILABLE" ? t.none : t.available;
  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={pdPaths.list}>{pdCopy.detail.crumb}</Link>
        {" / "}
        <strong>{demand.reference}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
        <span className={`pa-badge ${selected ? "pa-badge--ok" : declined ? "pa-badge--closed" : "pa-badge--ok"}`}><DpIcon name={declined ? "xCircle" : "check"} /> {badge}</span>
      </div>
      <div className="pa-grid">
        <section className="pa-card">
          <div className="pa-recap-article">
            <div className="pa-draft-preview__photo">
              {demand.product.imageUrl ? <img src={demand.product.imageUrl} alt="" /> : <DpIcon name="camera" />}
            </div>
            <div>
              <h2>{demand.product.title}</h2>
              <p className="pd-ref"><DpIcon name="list" /> {demand.reference}</p>
              <p className="pa-badge"><DpIcon name="sliders" /> {chip}</p>
            </div>
          </div>
          <table className="pa-recap" style={{ marginTop: "0.75rem" }}>
            <tbody>
              <tr>
                <th><DpIcon name="layers" /> {t.qty}</th>
                <td>
                  <span className="pd-qty-split">
                    <span><small>{t.asked}</small><strong>{demand.requestedQty} {unitWord(demand.product.terms.rentalMode, demand.requestedQty)}</strong></span>
                    <span className="pd-split" />
                    <span><small>{t.offered}</small><strong>{demand.replyQty ?? 0} {unitWord(demand.product.terms.rentalMode, demand.replyQty ?? 0)}</strong></span>
                  </span>
                </td>
              </tr>
              <tr><th><DpIcon name="calendar" /> {t.period}</th><td>{formatFrRange(demand.replyStart || demand.startDate, demand.replyEnd || demand.endDate)}</td></tr>
              <tr><th><DpIcon name="pin" /> {t.place}</th><td>{demand.commune}</td></tr>
              <tr><th><DpIcon name="van" /> {t.delivery}</th><td>{demandDeliveryLine(demand.replyDelivery, demand.replyFees)}</td></tr>
            </tbody>
          </table>
          {demand.replyMessage ? (
            <blockquote className="pd-quote"><DpIcon name="quote" /> {demand.replyMessage}</blockquote>
          ) : null}
          {demand.outcomeNote ? (
            <p className="pa-callout pa-callout--ok" style={{ marginTop: "0.75rem" }}>
              <DpIcon name="chat" />
              <span><strong>ONLOUTOU</strong><br />{demand.outcomeNote}</span>
            </p>
          ) : null}
        </section>
        <aside className="pa-aside">
          <PaSect>{t.nextTitle}</PaSect>
          <ul className="pa-how">
            {next.map((item) => (
              <li key={item.text}>
                <span className="pa-how__icon"><DpIcon name={item.icon} /></span>
                <div>{item.text}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <p className={`pa-callout ${selected ? "pa-callout--ok" : "pa-callout--info"}`} style={{ marginTop: "0.75rem" }}>
        <DpIcon name="info" />
        <span>
          <strong>{selected ? t.selectedBanner : declined ? t.declinedBanner : t.bannerTitle}</strong>
          <br />
          {selected ? t.selectedBannerText : declined ? t.declinedBannerText : t.bannerText}
        </span>
      </p>
      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={pdPaths.list} className="pa-btn">← {t.back}</Link>
          {demand.location ? (
            <Link href={pdPaths.location(demand.location.id)} className="pa-btn pa-btn--yellow">{t.seeLocation} →</Link>
          ) : canEditDemandReply(demand) ? (
            <Link href={pdPaths.reply(demand.id)} className="pa-btn pa-btn--yellow">{t.editReply} →</Link>
          ) : (
            <Link href={paPaths.article(demand.product.id)} className="pa-btn"><DpIcon name="eye" /> {t.seeArticle}</Link>
          )}
          <p className="pd-help" style={{ marginLeft: "auto" }}><DpIcon name="help" /> {t.help}<br /><Link href={pdPaths.contact} className="pa-link"><DpIcon name="mail" /> {t.contact}</Link></p>
        </div>
      </div>
    </div>
  );
}

export function demandTariffLine(demand: PartnerDemand) {
  return pdCopy.reply.tariff
    .replace("{price}", formatPrice(demand.product.terms))
    .replace("{min}", minLabel(demand.product.terms.minDuration));
}

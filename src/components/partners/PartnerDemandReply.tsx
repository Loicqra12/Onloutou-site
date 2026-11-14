"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { pdCopy, pdPaths } from "@/content/partner-demands";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaField, PaSect } from "@/components/partners/PaField";
import { demandQtyPhrase, formatFrRange, unitWord } from "@/lib/partner-articles";
import { paCopy, paPaths } from "@/content/partner-articles";
import { canEditDemandReply, demandServiceLine, type PartnerDemand, type PartnerDemandReplyKind } from "@/lib/partner-demands";
import { demandTariffLine } from "@/components/partners/PartnerDemandDetail";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

export function PartnerDemandReply({ demandId }: { demandId: string }) {
  const router = useRouter();
  const t = pdCopy.reply;
  const [demand, setDemand] = useState<PartnerDemand | null>(null);
  const [kind, setKind] = useState<PartnerDemandReplyKind>("ADJUSTMENT");
  const [qty, setQty] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [delivery, setDelivery] = useState(t.deliveryYes);
  const [fees, setFees] = useState(t.feesAgree);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ demand: PartnerDemand }>(`/partner/demands/${demandId}`);
      if (!res.ok) { setError(res.error); return; }
      const d = res.data.demand;
      setDemand(d);
      if (d.status !== "PENDING" && !canEditDemandReply(d)) {
        router.replace(pdPaths.detail(demandId));
        return;
      }
      if (d.status === "ANSWERED" && d.replyKind) {
        setKind(d.replyKind);
        setQty(Math.max(1, d.replyQty || 1));
        setStart(d.replyStart || d.startDate);
        setEnd(d.replyEnd || d.endDate);
        setDelivery(d.replyDelivery || t.deliveryYes);
        setFees(d.replyFees || t.feesAgree);
        setMessage(d.replyMessage || "");
        return;
      }
      setQty(Math.max(1, d.stock.available || 1));
      setStart(d.startDate);
      setEnd(d.endDate);
      if (d.stock.available <= 0) setKind("UNAVAILABLE");
      else if (d.stock.available < d.requestedQty) setKind("ADJUSTMENT");
      else setKind("AVAILABLE");
    })();
  }, [demandId, router, t.deliveryYes, t.feesAgree]);

  async function send() {
    if (!demand) return;
    setBusy(true); setError(null);
    const res = await apiFetch<{ demand: PartnerDemand }>(`/partner/demands/${demandId}/respond`, {
      method: "POST",
      json: {
        kind,
        quantity: kind === "UNAVAILABLE" ? 0 : qty,
        startDate: start,
        endDate: end,
        delivery,
        fees,
        message,
      },
    });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    router.push(pdPaths.detail(demandId));
  }

  if (!demand) return error ? <p className="pa-error">{error}</p> : <p>{paCopy.loading}</p>;
  const editing = canEditDemandReply(demand);

  const available = demand.stock.available;
  const unit = unitWord(demand.product.terms.rentalMode, available);
  const choices: { id: PartnerDemandReplyKind; title: string; text: string; icon: "check" | "pen" | "calendarX" }[] = [
    { id: "AVAILABLE", title: t.available, text: t.availableText, icon: "check" },
    { id: "ADJUSTMENT", title: t.adjust, text: t.adjustText, icon: "pen" },
    { id: "UNAVAILABLE", title: t.none, text: t.noneText, icon: "calendarX" },
  ];
  const reqUnit = unitWord(demand.product.terms.rentalMode, demand.requestedQty);
  const offeredUnit = unitWord(demand.product.terms.rentalMode, kind === "UNAVAILABLE" ? 0 : qty);

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={paPaths.home} aria-label="Accueil"><DpIcon name="home" /></Link>
        {" / "}
        <Link href={pdPaths.list}>{pdCopy.detail.crumb}</Link>
        {" / "}
        <Link href={pdPaths.detail(demand.id)}>{demand.reference}</Link>
        {" / "}
        <strong>{editing ? t.editCrumb : t.crumb}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{editing ? t.editTitle : t.title}</h1>
          <p>{t.summary
            .replace("{qty}", demandQtyPhrase(demand.product.title, demand.product.terms.rentalMode, demand.requestedQty))
            .replace("{period}", formatFrRange(demand.startDate, demand.endDate))
            .replace("{commune}", demand.commune)}</p>
        </div>
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      <div className="pd-choices" role="radiogroup" aria-label={t.title}>
        {choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            className={`pd-choice${kind === choice.id ? " is-on" : ""}`}
            onClick={() => setKind(choice.id)}
            aria-pressed={kind === choice.id}
          >
            <strong><DpIcon name={choice.icon} /> {choice.title}</strong>
            <p>{choice.text}</p>
          </button>
        ))}
      </div>

      <p className="pa-callout pa-callout--info" style={{ margin: "0.75rem 0" }}>
        <DpIcon name="info" /> {t.hint.replace("{n}", String(available)).replace("{unit}", unit).replace("{s}", available > 1 ? "s" : "").replace("{req}", String(demand.requestedQty))}
      </p>

      <div className="pa-grid">
        <section className="pa-card">
          <PaSect>{t.formTitle}</PaSect>
          {kind !== "UNAVAILABLE" ? (
            <>
              <div className="pa-fields">
                <PaField id="pd-qty" label={t.qty} required select icon="layers">
                  <select id="pd-qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {Array.from({ length: Math.max(1, demand.stock.total) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {unitWord(demand.product.terms.rentalMode, n)}</option>
                    ))}
                  </select>
                </PaField>
                <PaField id="pd-start" label={t.start} required icon="calendar">
                  <input id="pd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                </PaField>
                <PaField id="pd-end" label={t.end} required icon="calendar">
                  <input id="pd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                </PaField>
              </div>
              <div className="pa-fields pa-fields--2" style={{ marginTop: "0.55rem" }}>
                <PaField id="pd-del" label={t.delivery} required select icon="van">
                  <select id="pd-del" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                    <option>{t.deliveryYes}</option>
                    <option>Non</option>
                  </select>
                </PaField>
                <PaField id="pd-fees" label={t.fees} required select icon="coins">
                  <select id="pd-fees" value={fees} onChange={(e) => setFees(e.target.value)}>
                    <option>{t.feesAgree}</option>
                    <option>Inclus</option>
                  </select>
                </PaField>
              </div>
            </>
          ) : null}
          <PaField id="pd-msg" label={t.message} required className="pa-field pa-field--full" icon="chat">
            <textarea id="pd-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
          </PaField>
          <p className="pa-callout pa-callout--ok" style={{ marginTop: "0.65rem" }}><DpIcon name="info" /> {demandTariffLine(demand)}</p>
        </section>

        <aside className="pa-aside pa-draft-preview">
          <div className="pa-draft-preview__photo">
            {demand.product.imageUrl ? <img src={demand.product.imageUrl} alt="" /> : <DpIcon name="camera" />}
          </div>
          <h3>{demand.product.title}</h3>
          <ul className="pa-draft-preview__meta">
            <li><DpIcon name="shop" /> {demand.partner.name}</li>
            {demand.partner.commune ? <li><DpIcon name="pin" /> {demand.partner.commune}</li> : null}
          </ul>
          <div className="pd-offer">
            <span>{t.asked}<strong>{demand.requestedQty} {reqUnit}</strong></span>
            <span className="is-on">{t.offered}<strong>{kind === "UNAVAILABLE" ? 0 : qty} {offeredUnit}</strong></span>
          </div>
          <ul className="pa-draft-preview__meta">
            <li><DpIcon name="calendar" /> {t.date} {formatFrRange(start || demand.startDate, end || demand.endDate)}</li>
            <li><DpIcon name="pin" /> {t.commune} {demand.commune}</li>
            <li><DpIcon name="van" /> {t.service} {demandServiceLine(delivery, fees)}</li>
          </ul>
        </aside>
      </div>

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={pdPaths.detail(demand.id)} className="pa-btn">← {t.back}</Link>
          <p className="pa-hint" style={{ margin: 0 }}><DpIcon name="info" /> {editing ? t.editHint : t.noStock}</p>
          <button type="button" className="pa-btn pa-btn--yellow" disabled={busy || message.trim().length < 8} onClick={() => void send()}>{editing ? t.editSend : t.send} →</button>
        </div>
      </div>
    </div>
  );
}

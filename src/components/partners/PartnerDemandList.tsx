"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { pdCopy, pdPaths } from "@/content/partner-demands";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaBox } from "@/components/partners/PaField";
import { formatFrRange, unitWord } from "@/lib/partner-articles";
import { demandStatusBadge, demandStatusLabel, type PartnerDemand, type PartnerDemandStatus } from "@/lib/partner-demands";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

const TABS = ["all", "pending", "answered", "closed"] as const;
type Tab = (typeof TABS)[number];

function tabOf(status: PartnerDemandStatus): Tab {
  if (status === "PENDING") return "pending";
  if (status === "ANSWERED") return "answered";
  return "closed";
}

export function PartnerDemandList() {
  const t = pdCopy.list;
  const [items, setItems] = useState<PartnerDemand[]>([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, answered: 0, closed: 0 });
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ items: PartnerDemand[]; counts: typeof counts }>("/partner/demands");
      if (!res.ok) { setError(res.error); return; }
      const rank = { PENDING: 0, ANSWERED: 1, CLOSED: 2 };
      setItems([...res.data.items].sort((a, b) => rank[a.status] - rank[b.status] || b.createdAt.localeCompare(a.createdAt)));
      setCounts(res.data.counts);
    })();
  }, []);

  const rows = useMemo(() => items.filter((item) => {
    if (tab !== "all" && tabOf(item.status) !== tab) return false;
    if (q.trim() && !`${item.reference} ${item.product.title}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  }), [items, tab, q]);

  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      <nav className="pa-tabs" aria-label="Statut des demandes">
        {TABS.map((id) => (
          <button type="button" key={id} className={tab === id ? "is-active" : undefined} onClick={() => setTab(id)}>
            {t.tabs[id]} <span className="pa-tabs__n">{counts[id]}</span>
          </button>
        ))}
      </nav>

      <div className="pa-filters">
        <PaBox icon="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </PaBox>
        <PaBox select>
          <select aria-label={t.sort} defaultValue="recent">
            <option value="recent">{t.sort}</option>
          </select>
        </PaBox>
      </div>

      {rows.length === 0 ? (
        <section className="pa-card"><p>{t.empty}</p></section>
      ) : (
        <table className="pa-table pd-table">
          <thead>
            <tr>
              <th>{t.cols.demand}</th>
              <th>{t.cols.period}</th>
              <th>{t.cols.qty}</th>
              <th>{t.cols.place}</th>
              <th>{t.cols.status}</th>
              <th>{t.cols.action}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="pa-row">
                    {row.product.imageUrl ? <img src={row.product.imageUrl} alt="" /> : <span className="pa-row__icon"><DpIcon name="box" /></span>}
                    <div>
                      <h3><Link href={pdPaths.detail(row.id)}>{row.product.title}</Link></h3>
                      <p><DpIcon name="list" /> {row.reference}</p>
                    </div>
                  </div>
                </td>
                <td><span className="pd-cell"><DpIcon name="calendar" /> {formatFrRange(row.startDate, row.endDate)}</span></td>
                <td><span className="pd-cell"><DpIcon name="layers" /> {row.requestedQty} {unitWord(row.product.terms.rentalMode, row.requestedQty)}</span></td>
                <td><span className="pd-cell"><DpIcon name="pin" /> {row.commune}</span></td>
                <td><span className={`pa-badge ${demandStatusBadge(row.status, row.outcome)}`}>
                  <DpIcon name={row.status === "PENDING" ? "hourglass" : row.outcome === "SELECTED" ? "check" : row.outcome === "DECLINED" || row.outcome === "CANCELLED" || row.outcome === "EXPIRED" ? "xCircle" : "check"} /> {demandStatusLabel(row.status, row.outcome)}
                </span></td>
                <td>
                  {row.status === "PENDING" ? (
                    <Link href={pdPaths.detail(row.id)} className="pa-btn pa-btn--yellow">{t.reply} →</Link>
                  ) : row.location ? (
                    <Link href={pdPaths.location(row.location.id)} className="pa-btn pa-btn--yellow">{pdCopy.listAction.location} →</Link>
                  ) : (
                    <Link href={pdPaths.detail(row.id)} className="pa-btn">{t.consult} →</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pd-foot">
        <p className="pa-callout pa-callout--ok"><DpIcon name="info" /> {t.foot}</p>
        <p className="pd-help"><DpIcon name="help" /> {t.help}<br /><Link href={pdPaths.contact} className="pa-link"><DpIcon name="mail" /> {t.contact}</Link></p>
      </div>
    </div>
  );
}

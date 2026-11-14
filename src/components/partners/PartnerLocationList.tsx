"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { plCopy } from "@/content/partner-locations";
import { paPaths } from "@/content/partner-articles";
import { pdPaths } from "@/content/partner-demands";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaBox } from "@/components/partners/PaField";
import { formatFrRange, unitWord } from "@/lib/partner-articles";
import { locationStatusBadge, locationStatusLabel, type PartnerLocation, type PartnerLocationStatus } from "@/lib/partner-ops";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

const TABS = ["all", "prepare", "progress", "returned", "done"] as const;
type Tab = (typeof TABS)[number];

function tabOf(status: PartnerLocationStatus): Tab {
  if (status === "TO_PREPARE") return "prepare";
  if (status === "IN_PROGRESS") return "progress";
  if (status === "COMPLETED") return "done";
  return "returned";
}

export function PartnerLocationList() {
  const t = plCopy.list;
  const [items, setItems] = useState<PartnerLocation[]>([]);
  const [counts, setCounts] = useState({ all: 0, prepare: 0, progress: 0, returned: 0, done: 0 });
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ items: PartnerLocation[]; counts: typeof counts }>("/partner/locations");
      if (!res.ok) { setError(res.error); return; }
      setItems(res.data.items);
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

      <nav className="pa-tabs" aria-label="Statut des locations">
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
      </div>

      {rows.length === 0 ? (
        <section className="pa-card">
          <p><strong>{t.empty}</strong></p>
          <p>{t.emptyText}</p>
        </section>
      ) : (
        <table className="pa-table pd-table">
          <thead>
            <tr>
              <th>{t.cols.location}</th>
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
                      <h3>{row.product.title}</h3>
                      <p><DpIcon name="list" /> {row.reference}</p>
                    </div>
                  </div>
                </td>
                <td><span className="pd-cell"><DpIcon name="calendar" /> {formatFrRange(row.startDate, row.endDate)}</span></td>
                <td><span className="pd-cell"><DpIcon name="layers" /> {row.quantity} {unitWord(row.product.terms.rentalMode, row.quantity)}</span></td>
                <td><span className="pd-cell"><DpIcon name="pin" /> {row.commune}</span></td>
                <td><span className={`pa-badge ${locationStatusBadge(row.status)}`}>
                  <DpIcon name={row.status === "COMPLETED" ? "check" : "hourglass"} /> {locationStatusLabel(row.status)}
                </span></td>
                <td><Link href={paPaths.location(row.id)} className="pa-btn pa-btn--yellow">{t.open} →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pd-foot">
        <p className="pa-callout pa-callout--info"><DpIcon name="info" /> {t.foot}</p>
        <p className="pd-help"><Link href={pdPaths.help} className="pa-link"><DpIcon name="help" /> Besoin d’aide ?</Link></p>
      </div>
    </div>
  );
}

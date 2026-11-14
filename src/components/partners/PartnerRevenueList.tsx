"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { prCopy, prPaths } from "@/content/partner-revenues";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaBox } from "@/components/partners/PaField";
import { formatFrRange } from "@/lib/partner-articles";
import {
  formatFcfa,
  formatRate,
  payoutMethodLabel,
  revenueStatusBadge,
  revenueStatusLabel,
  type PartnerFinanceTotals,
  type PartnerPayout,
  type PartnerRevenue,
  type PartnerRevenueStatus,
} from "@/lib/partner-revenues";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

const TABS = ["all", "pending", "paid", "payouts"] as const;
type Tab = (typeof TABS)[number];

function tabOf(status: PartnerRevenueStatus): Tab {
  return status === "PENDING" ? "pending" : "paid";
}

export function PartnerRevenueList() {
  const t = prCopy.list;
  const [items, setItems] = useState<PartnerRevenue[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, paid: 0 });
  const [totals, setTotals] = useState<PartnerFinanceTotals>({
    pendingNet: 0,
    receivedThisMonth: 0,
    commissionThisMonth: 0,
    billedThisMonth: 0,
  });
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{
        items: PartnerRevenue[];
        payouts: PartnerPayout[];
        counts: typeof counts;
        totals: PartnerFinanceTotals;
      }>("/partner/revenues");
      if (!res.ok) { setError(res.error); return; }
      setItems(res.data.items);
      setPayouts(res.data.payouts);
      setCounts(res.data.counts);
      setTotals(res.data.totals);
    })();
  }, []);

  const rows = useMemo(() => items.filter((item) => {
    if (tab !== "all" && tab !== "payouts" && tabOf(item.status) !== tab) return false;
    if (q.trim() && !`${item.reference} ${item.location.reference} ${item.product.title}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  }), [items, tab, q]);

  const payoutRows = useMemo(() => payouts.filter((item) => {
    if (q.trim() && !`${item.reference} ${item.revenues.map((r) => r.locationRef).join(" ")}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  }), [payouts, q]);

  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      <div className="pa-stats">
        <div className="pa-stat">
          <DpIcon name="hourglass" />
          <div><strong>{formatFcfa(totals.pendingNet)}</strong><span>{t.pendingTitle}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="check" />
          <div><strong>{formatFcfa(totals.receivedThisMonth)}</strong><span>{t.receivedTitle}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="coins" />
          <div><strong>{formatFcfa(totals.commissionThisMonth)}</strong><span>{t.commissionTitle}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="calendar" />
          <div><strong>{totals.billedThisMonth}</strong><span>{t.billedTitle}</span></div>
        </div>
      </div>

      <nav className="pa-tabs" aria-label="Statut des revenus">
        {TABS.map((id) => (
          <button type="button" key={id} className={tab === id ? "is-active" : undefined} onClick={() => setTab(id)}>
            {t.tabs[id]} <span className="pa-tabs__n">{id === "payouts" ? payouts.length : counts[id === "all" ? "all" : id]}</span>
          </button>
        ))}
      </nav>

      <div className="pa-filters">
        <PaBox icon="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </PaBox>
      </div>

      {tab === "payouts" ? (
        payoutRows.length === 0 ? (
          <section className="pa-card">
            <p><strong>{t.emptyPayouts}</strong></p>
            <p>{t.emptyPayoutsText}</p>
          </section>
        ) : (
          <table className="pa-table pd-table">
            <thead>
              <tr>
                <th>{t.payoutCols.payout}</th>
                <th>{t.payoutCols.date}</th>
                <th>{t.payoutCols.method}</th>
                <th>{t.payoutCols.locations}</th>
                <th>{t.payoutCols.amount}</th>
              </tr>
            </thead>
            <tbody>
              {payoutRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="pa-row">
                      <span className="pa-row__icon"><DpIcon name="coins" /></span>
                      <div>
                        <h3>{row.reference}</h3>
                        <p>{row.note || "Reversement ONLOUTOU"}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="pd-cell"><DpIcon name="calendar" /> {new Date(row.paidAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span></td>
                  <td><span className="pd-cell"><DpIcon name="send" /> {payoutMethodLabel(row.method)}</span></td>
                  <td>
                    {row.revenues.map((item) => (
                      <p key={item.id} style={{ margin: 0 }}>
                        <Link href={prPaths.detail(item.id)} className="pa-link">{item.locationRef}</Link>
                        {" · "}{item.productTitle}
                      </p>
                    ))}
                  </td>
                  <td><strong>{formatFcfa(row.amount)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : rows.length === 0 ? (
        <section className="pa-card">
          <p><strong>{t.empty}</strong></p>
          <p>{t.emptyText}</p>
        </section>
      ) : (
        <table className="pa-table pd-table">
          <thead>
            <tr>
              <th>{t.cols.revenue}</th>
              <th>{t.cols.period}</th>
              <th>{t.cols.gross}</th>
              <th>{t.cols.commission}</th>
              <th>{t.cols.net}</th>
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
                      <p><DpIcon name="list" /> {row.location.reference} · {row.reference}</p>
                    </div>
                  </div>
                </td>
                <td><span className="pd-cell"><DpIcon name="calendar" /> {formatFrRange(row.location.startDate, row.location.endDate)}</span></td>
                <td>{formatFcfa(row.grossAmount)}</td>
                <td>{formatFcfa(row.commissionAmount)} <span className="pa-meta">({formatRate(row.commissionBps)})</span></td>
                <td><strong>{formatFcfa(row.netAmount)}</strong></td>
                <td>
                  <span className={`pa-badge ${revenueStatusBadge(row.status)}`}>
                    <DpIcon name={row.status === "PAID" ? "check" : "hourglass"} /> {revenueStatusLabel(row.status)}
                  </span>
                </td>
                <td><Link href={prPaths.detail(row.id)} className="pa-btn pa-btn--yellow">{t.open} →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pd-foot">
        <p className="pa-callout pa-callout--info"><DpIcon name="info" /> {t.foot}</p>
        <p className="pd-help"><Link href={prPaths.help} className="pa-link"><DpIcon name="help" /> Besoin d’aide ?</Link></p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { pnCopy } from "@/content/partner-locations";
import { DpIcon, type DpIconName } from "@/components/partners/DpIcon";
import type { PartnerNotice } from "@/lib/partner-ops";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

const KIND_ICON: Record<PartnerNotice["kind"], DpIconName> = {
  DEMAND: "list",
  LOCATION: "calendar",
  ARTICLE: "layers",
  PROFILE: "user",
  MESSAGE: "bell",
  PAYOUT: "coins",
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function PartnerNotifications() {
  const [items, setItems] = useState<PartnerNotice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await apiFetch<{ items: PartnerNotice[] }>("/partner/notifications");
    if (!res.ok) { setError(res.error); return; }
    setItems(res.data.items);
  }

  useEffect(() => { void load(); }, []);

  async function markAll() {
    setBusy(true);
    const res = await apiFetch<{ items: PartnerNotice[] }>("/partner/notifications/read", { method: "POST", json: {} });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    setItems(res.data.items);
  }

  const unread = items.filter((item) => !item.readAt).length;

  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{pnCopy.title}</h1>
          <p>{pnCopy.lead}</p>
        </div>
        {unread > 0 ? (
          <button type="button" className="pa-btn" disabled={busy} onClick={() => void markAll()}>{pnCopy.markAll}</button>
        ) : null}
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}
      {items.length === 0 ? (
        <section className="pa-card">
          <p><strong>{pnCopy.empty}</strong></p>
          <p>{pnCopy.emptyText}</p>
        </section>
      ) : (
        <ul className="pn-list">
          {items.map((item) => {
            const inner = (
              <>
                <span className="pa-how__icon"><DpIcon name={KIND_ICON[item.kind]} /></span>
                <div>
                  <h3>{item.title}{!item.readAt ? <span className="pa-badge" style={{ marginLeft: "0.5rem" }}>{pnCopy.unread}</span> : null}</h3>
                  <p>{item.body}</p>
                  <p className="pa-meta">{formatWhen(item.createdAt)}</p>
                </div>
              </>
            );
            return (
              <li key={item.id} className={`pn-item${!item.readAt ? " is-unread" : ""}`}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="pn-item__link"
                    onClick={() => {
                      if (!item.readAt) void apiFetch("/partner/notifications/read", { method: "POST", json: { ids: [item.id] } });
                    }}
                  >
                    {inner}
                  </Link>
                ) : <div className="pn-item__link">{inner}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

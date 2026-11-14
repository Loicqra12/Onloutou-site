"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { articleFamilies } from "@/content/article-taxonomy";
import { paCopy, paPaths } from "@/content/partner-articles";
import { pdCopy, pdPaths } from "@/content/partner-demands";
import { DpIcon } from "@/components/partners/DpIcon";
import { apiFetch } from "@/lib/api/client";
import { formatFrRange, gapLabel, quantityLabel, type PartnerArticle } from "@/lib/partner-articles";
import type { PartnerDemand } from "@/lib/partner-demands";
import type { PartnerLocation } from "@/lib/partner-ops";
import { locationStatusLabel } from "@/lib/partner-ops";
import { formatFcfa, type PartnerRevenue } from "@/lib/partner-revenues";
import "@/styles/partner-articles.css";

function resSorted(items: PartnerDemand[]) {
  const rank: Record<PartnerDemand["status"], number> = { PENDING: 0, ANSWERED: 1, CLOSED: 2 };
  return [...items].sort((a, b) => rank[a.status] - rank[b.status] || b.createdAt.localeCompare(a.createdAt));
}

function familyIcon(icon: (typeof articleFamilies)[number]["icon"]) {
  const map: Record<string, "fridge" | "laptop" | "chair" | "plates" | "van" | "moto" | "excavator" | "tools" | "connected" | "stroller" | "shop" | "box" | "layers"> = {
    fridge: "fridge",
    laptop: "laptop",
    chair: "chair",
    plates: "plates",
    stroller: "stroller",
    van: "van",
    moto: "moto",
    excavator: "excavator",
    tools: "tools",
    connected: "connected",
  };
  return map[icon] ?? "box";
}

export function PartnerArticlesHome({
  name,
  commune,
  organization,
  articles,
}: {
  name: string;
  commune?: string | null;
  organization?: string | null;
  articles: PartnerArticle[];
}) {
  const drafts = articles.filter((a) => a.status === "DRAFT");
  const corrections = articles.filter((a) => a.status === "REJECTED");
  const published = articles.filter((a) => a.status === "APPROVED");
  const todo = [...corrections, ...drafts];
  const [demands, setDemands] = useState<PartnerDemand[]>([]);
  const [locations, setLocations] = useState<PartnerLocation[]>([]);
  const [pendingRevenues, setPendingRevenues] = useState<PartnerRevenue[]>([]);
  const [pendingNet, setPendingNet] = useState(0);
  useEffect(() => {
    void (async () => {
      const [dRes, lRes, rRes] = await Promise.all([
        apiFetch<{ items: PartnerDemand[] }>("/partner/demands"),
        apiFetch<{ items: PartnerLocation[] }>("/partner/locations"),
        apiFetch<{ items: PartnerRevenue[]; totals: { pendingNet: number } }>("/partner/revenues"),
      ]);
      if (dRes.ok) setDemands(resSorted(dRes.data.items));
      if (lRes.ok) {
        setLocations(lRes.data.items.filter((row) => row.status === "TO_PREPARE" || row.status === "TO_RETURN").slice(0, 3));
      }
      if (rRes.ok) {
        setPendingRevenues(rRes.data.items.filter((row) => row.status === "PENDING").slice(0, 3));
        setPendingNet(rRes.data.totals.pendingNet);
      }
    })();
  }, []);
  const pendingDemands = demands.filter((d) => d.status === "PENDING").length;
  const pendingLocations = locations.length;
  const recentDemands = demands.slice(0, 3);

  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{paCopy.home.hello.replace("{name}", name)}</h1>
          <p>{paCopy.home.approvedLead}</p>
        </div>
        <Link href={paPaths.nouveau} className="pa-btn pa-btn--yellow">+ {paCopy.propose}</Link>
      </div>

      <div className="pa-approved">
        <div>
          <h2><DpIcon name="check" /> {paCopy.home.approvedBanner}</h2>
          {organization || commune ? <p>{[organization, commune].filter(Boolean).join(" · ")}</p> : null}
        </div>
        <Link href={paPaths.profile} className="pa-btn">{paCopy.home.seeProfile} →</Link>
      </div>

      <div className="pa-stats">
        <div className="pa-stat">
          <DpIcon name="pen" />
          <div><strong>{drafts.length}</strong><span>{paCopy.home.drafts}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="layers" />
          <div><strong>{published.length}</strong><span>{paCopy.home.published}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="box" />
          <div><strong>{pendingDemands}</strong><span>{paCopy.home.requests}</span></div>
        </div>
        <div className="pa-stat">
          <DpIcon name="calendar" />
          <div><strong>{pendingLocations}</strong><span>{paCopy.home.locations}</span></div>
        </div>
      </div>

      <div className="pa-grid">
        <section className="pa-card">
          <h2 className="pa-sect"><DpIcon name="list" /> {articles.length === 0 ? paCopy.home.emptyTitle : paCopy.home.todo}<span className="pa-sect__rule" aria-hidden /></h2>
          {articles.length === 0 ? (
            <>
              <p>{paCopy.home.emptyText}</p>
              <Link href={paPaths.nouveau} className="pa-btn pa-btn--yellow">{paCopy.proposeFirst}</Link>
            </>
          ) : (
            <ul className="pa-todo">
              {todo.map((item) => (
                <li key={item.id}>
                  {item.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0].url} alt="" />
                  ) : (
                    <span className="pa-todo__icon" aria-hidden><DpIcon name={item.familySlug === "informatique" ? "laptop" : item.familySlug === "reception" ? "plates" : item.familySlug === "electromenager" ? "fridge" : "camera"} /></span>
                  )}
                  <div>
                    <h3>{item.title || "Nouvelle fiche"}</h3>
                    <p>{gapLabel(item) ?? quantityLabel(item)}</p>
                  </div>
                  <Link href={paPaths.article(item.id, item.status === "PENDING_REVIEW" ? "suivi" : item.status === "REJECTED" ? undefined : "article")} className="pa-btn pa-btn--yellow">
                    {item.status === "REJECTED" ? "Corriger" : paCopy.continue} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="pa-aside">
          <h2 className="pa-sect"><DpIcon name="doc" /> {paCopy.home.howTitle}<span className="pa-sect__rule" aria-hidden /></h2>
          <ol className="pa-how">
            {paCopy.home.how.map((step) => (
              <li key={step.n}>
                <span className="pa-how__n">{step.n}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="pa-families">
        <strong><DpIcon name="tag" /> {paCopy.home.familiesNote}</strong>
        <div className="pa-families__list">
          {articleFamilies.slice(0, 4).map((fam) => (
            <span key={fam.slug}><DpIcon name={familyIcon(fam.icon)} /> {fam.shortLabel}</span>
          ))}
        </div>
      </div>

      {pendingRevenues.length > 0 ? (
        <section className="pa-card" style={{ marginTop: "1rem" }}>
          <h2 className="pa-sect"><DpIcon name="coins" /> {paCopy.home.pendingRevenue}<span className="pa-sect__rule" aria-hidden /></h2>
          <p className="pa-hint" style={{ margin: "0 0 0.65rem" }}><DpIcon name="info" /> {formatFcfa(pendingNet)} en attente de reversement par ONLOUTOU.</p>
          <ul className="pa-todo">
            {pendingRevenues.map((item) => (
              <li key={item.id}>
                {item.product.imageUrl ? <img src={item.product.imageUrl} alt="" /> : <span className="pa-todo__icon"><DpIcon name="coins" /></span>}
                <div>
                  <h3>{item.product.title}</h3>
                  <p>{item.location.reference} · {formatFcfa(item.netAmount)}</p>
                </div>
                <Link href={paPaths.revenue(item.id)} className="pa-btn pa-btn--yellow">Consulter →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {locations.length > 0 ? (
        <section className="pa-card" style={{ marginTop: "1rem" }}>
          <h2 className="pa-sect"><DpIcon name="calendar" /> Locations à préparer<span className="pa-sect__rule" aria-hidden /></h2>
          <ul className="pa-todo">
            {locations.map((item) => (
              <li key={item.id}>
                {item.product.imageUrl ? <img src={item.product.imageUrl} alt="" /> : <span className="pa-todo__icon"><DpIcon name="box" /></span>}
                <div>
                  <h3>{item.product.title}</h3>
                  <p>{item.reference} · {locationStatusLabel(item.status)} · {formatFrRange(item.startDate, item.endDate)}</p>
                </div>
                <Link href={paPaths.location(item.id)} className="pa-btn pa-btn--yellow">Ouvrir →</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="pa-card" style={{ marginTop: "1rem" }}>
        <h2 className="pa-sect"><DpIcon name="mail" /> {paCopy.home.requestsTitle}<span className="pa-sect__rule" aria-hidden /></h2>
        {recentDemands.length === 0 ? (
          <>
            <p style={{ display: "flex", gap: "0.45rem", alignItems: "center", margin: "0" }}><DpIcon name="folder" /> <strong>{paCopy.home.requestsEmptyTitle}</strong></p>
            <p>{paCopy.home.requestsEmptyText}</p>
          </>
        ) : (
          <ul className="pa-todo">
            {recentDemands.map((item) => (
              <li key={item.id}>
                {item.product.imageUrl ? <img src={item.product.imageUrl} alt="" /> : <span className="pa-todo__icon"><DpIcon name="box" /></span>}
                <div>
                  <h3>{item.product.title}</h3>
                  <p>{item.reference} · {formatFrRange(item.startDate, item.endDate)}</p>
                </div>
                <Link href={pdPaths.detail(item.id)} className="pa-btn pa-btn--yellow">
                  {item.status === "PENDING" ? pdCopy.list.reply : pdCopy.list.consult} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

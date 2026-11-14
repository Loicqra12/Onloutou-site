"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { articleFamilies } from "@/content/article-taxonomy";
import { paCopy, paPaths } from "@/content/partner-articles";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaBox } from "@/components/partners/PaField";
import { articleFamilyLabel, gapLabel, quantityLabel, statusLabel, type PartnerArticle } from "@/lib/partner-articles";
import "@/styles/partner-articles.css";

const TABS = ["all", "draft", "review", "correct", "published", "paused", "archived"] as const;
type Tab = (typeof TABS)[number];

function tabOf(status: PartnerArticle["status"]): Tab {
  if (status === "DRAFT") return "draft";
  if (status === "PENDING_REVIEW") return "review";
  if (status === "REJECTED") return "correct";
  if (status === "APPROVED") return "published";
  if (status === "DISABLED") return "paused";
  if (status === "ARCHIVED") return "archived";
  return "all";
}

function actionHref(item: PartnerArticle): { href: string; label: string } {
  if (item.status === "PENDING_REVIEW") return { href: paPaths.article(item.id, "suivi"), label: "Voir" };
  if (item.status === "REJECTED") return { href: paPaths.article(item.id), label: "Corriger" };
  if (item.status === "APPROVED" || item.status === "DISABLED" || item.status === "ARCHIVED") return { href: paPaths.article(item.id), label: item.status === "ARCHIVED" ? "Consulter" : "Gérer" };
  return { href: paPaths.article(item.id, "article"), label: paCopy.continue };
}

export function PartnerArticlesList() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<PartnerArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [family, setFamily] = useState("");
  const tab = (searchParams.get("statut") as Tab) || "all";

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ products?: PartnerArticle[]; items?: PartnerArticle[] }>("/partner/products");
      if (!res.ok) { setError(res.error); return; }
      setArticles(res.data.products ?? res.data.items ?? []);
    })();
  }, []);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: articles.filter((a) => a.status !== "ARCHIVED").length, draft: 0, review: 0, correct: 0, published: 0, paused: 0, archived: 0 };
    for (const item of articles) {
      const t = tabOf(item.status);
      if (t !== "all") c[t] += 1;
    }
    return c;
  }, [articles]);

  const rows = articles.filter((item) => {
    if (tab === "all" && item.status === "ARCHIVED") return false;
    if (tab !== "all" && tabOf(item.status) !== tab) return false;
    if (family && item.familySlug !== family) return false;
    if (q.trim() && !`${item.title} ${item.reference ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  });

  const showPrivate = rows.some((r) => r.status === "DRAFT");

  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{paCopy.list.title}</h1>
          <p>{paCopy.list.lead}</p>
        </div>
        <Link href={paPaths.nouveau} className="pa-btn pa-btn--yellow">+ {paCopy.propose}</Link>
      </div>

      <nav className="pa-tabs" aria-label="Statut">
        {TABS.map((id) => (
          <Link key={id} href={`${paPaths.articles}?statut=${id}`} className={tab === id ? "is-active" : undefined}>
            {paCopy.tabs[id]} <span className="pa-tabs__n">{counts[id]}</span>
          </Link>
        ))}
      </nav>

      <div className="pa-filters">
        <div className="pa-control">
          <DpIcon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={paCopy.search} aria-label={paCopy.search} />
        </div>
        <div className="pa-filter-family">
          <label className="pa-label" htmlFor="pa-family">{paCopy.family}</label>
          <PaBox select>
            <select id="pa-family" value={family} onChange={(e) => setFamily(e.target.value)}>
              <option value="">{paCopy.allFamilies}</option>
              {articleFamilies.map((f) => <option key={f.slug} value={f.slug}>{f.label}</option>)}
            </select>
          </PaBox>
        </div>
      </div>

      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      {rows.length === 0 ? (
        <section className="pa-card">
          <p>{articles.length === 0 ? paCopy.home.emptyText : paCopy.list.empty}</p>
          {articles.length === 0 ? <Link href={paPaths.nouveau} className="pa-btn pa-btn--yellow">{paCopy.proposeFirst}</Link> : null}
        </section>
      ) : (
        <table className="pa-table">
          <thead>
            <tr>
              <th>{paCopy.cols.article}</th>
              <th>{paCopy.cols.family}</th>
              <th>{paCopy.cols.publication}</th>
              <th>{paCopy.cols.quantity}</th>
              <th>{paCopy.cols.action}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const action = actionHref(item);
              const gap = gapLabel(item);
              return (
                <tr key={item.id}>
                  <td>
                    <div className="pa-row">
                      {item.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0].url} alt="" />
                      ) : (
                        <span className="pa-row__icon" aria-hidden><DpIcon name={item.familySlug === "informatique" ? "laptop" : item.familySlug === "reception" ? "plates" : item.familySlug === "electromenager" ? "fridge" : "camera"} /></span>
                      )}
                      <div>
                        <h3>{item.title || "Nouvelle fiche"}</h3>
                        {gap ? <p><DpIcon name="list" /> {gap}</p> : null}
                      </div>
                    </div>
                  </td>
                  <td>{articleFamilyLabel(item) || "—"}</td>
                  <td><span className="pa-badge">{statusLabel(item.status)}</span></td>
                  <td>{quantityLabel(item)}</td>
                  <td>
                    <Link href={action.href} className="pa-btn pa-btn--yellow pa-btn--sm">{action.label} →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showPrivate ? (
        <p className="pa-private"><DpIcon name="eyeOff" /><span className="pa-private__rule" aria-hidden /><span>{paCopy.list.privateBanner}</span></p>
      ) : null}
      <p style={{ marginTop: "0.75rem" }}>
        <Link href={paPaths.nouveau} className="pa-link">{paCopy.list.categoryHelp}</Link>
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

type Family = {
  order: number;
  slug: string;
  label: string;
  shortLabel: string;
  categoriesCount: number;
  specsCount: number;
  articlesCount: number;
  status: string;
  visibility: { client: boolean; partner: boolean; admin: boolean };
  categories: { slug: string; label: string; specs: { id: string; label: string }[]; status: string }[];
  specs: { id: string; label: string; optional?: boolean }[];
  units: string[];
  publicPath: string;
};

type TaxonomyResponse = {
  banner: string;
  counts: { families: number; categories: number; specs: number; units: number; syncedSpaces: number };
  families: Family[];
  unpublished: { id: string; label: string; impact: string }[];
  controls: { linksOk: boolean; dependenciesOk: boolean; visibilityOk: boolean; deleteBlockedIfLinked: boolean };
  lastPublishedNote: string;
};

const SECTIONS = [
  { id: "familles", label: "Familles & catégories" },
  { id: "organisation", label: "Organisation" },
  { id: "locations", label: "Locations" },
  { id: "tarification", label: "Tarification" },
  { id: "documents", label: "Documents" },
  { id: "notifications", label: "Notifications" },
  { id: "sites", label: "Sites & zones" },
  { id: "integrations", label: "Intégrations" },
  { id: "donnees", label: "Données & conservation" },
] as const;

export function SettingsPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const section = params.get("section") || "familles";
  const selectedSlug = params.get("family");
  const [data, setData] = useState<TaxonomyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<TaxonomyResponse>("/admin/ops/settings/taxonomy");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(res.error);
        return;
      }
      setData(res.data);
      if (!selectedSlug && res.data.families[0]) {
        const copy = new URLSearchParams(params);
        copy.set("family", res.data.families[0].slug);
        if (!params.get("section")) copy.set("section", "familles");
        setParams(copy, { replace: true });
      }
    })();
  }, [nav]);

  const selected = data?.families.find((f) => f.slug === selectedSlug) || data?.families[0] || null;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / Paramètres</span>
      </div>
      <h1 className="as-h1">Paramètres de la plateforme</h1>
      {data?.banner ? <p className="as-banner as-banner--warn">{data.banner}</p> : null}
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="as-note">{notice}</p> : null}

      <div className="as-settings">
        <aside className="as-card as-settings__nav">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={section === item.id ? "is-on" : ""}
              onClick={() => {
                const copy = new URLSearchParams(params);
                copy.set("section", item.id);
                setParams(copy, { replace: true });
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <div className="as-settings__main">
          {section !== "familles" ? (
            <section className="as-card">
              <h2>{SECTIONS.find((s) => s.id === section)?.label}</h2>
              <p className="as-empty">
                Section réservée : paramètres financiers, fiscaux, notifications et intégrations nécessitent une validation
                dédiée avant activation. Aucune valeur inventée ici.
              </p>
            </section>
          ) : data ? (
            <>
              <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
                <div className="as-kpi">
                  <strong>{data.counts.families}</strong>
                  <span>Familles</span>
                </div>
                <div className="as-kpi">
                  <strong>{data.counts.categories}</strong>
                  <span>Sous-catégories</span>
                </div>
                <div className="as-kpi">
                  <strong>{data.counts.specs}</strong>
                  <span>Champs spécifiques</span>
                </div>
                <div className="as-kpi">
                  <strong>{data.counts.units}</strong>
                  <span>Unités</span>
                </div>
                <div className="as-kpi">
                  <strong>{data.counts.syncedSpaces}</strong>
                  <span>Espaces synchronisés</span>
                </div>
              </div>

              <section className="as-card" style={{ marginBottom: "0.85rem" }}>
                <h2>Source unique des familles</h2>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Famille</th>
                        <th>Sous-cat.</th>
                        <th>Champs</th>
                        <th>Articles</th>
                        <th>Visibilité</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.families.map((row) => (
                        <tr
                          key={row.slug}
                          className={row.slug === selected?.slug ? "as-row--on" : undefined}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const copy = new URLSearchParams(params);
                            copy.set("family", row.slug);
                            setParams(copy, { replace: true });
                          }}
                        >
                          <td>{row.order}</td>
                          <td>{row.label}</td>
                          <td>{row.categoriesCount}</td>
                          <td>{row.specsCount}</td>
                          <td>{row.articlesCount}</td>
                          <td>
                            {[row.visibility.client && "Client", row.visibility.partner && "Partenaire", row.visibility.admin && "Admin"]
                              .filter(Boolean)
                              .join(" · ")}
                          </td>
                          <td>
                            <span className="as-badge as-badge--stage">Actif</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {selected ? (
                <section className="as-card as-people-detail">
                  <div className="as-card__head">
                    <h2>{selected.label}</h2>
                    <a className="as-btn" href={selected.publicPath} target="_blank" rel="noreferrer">
                      Aperçu public
                    </a>
                  </div>
                  <div className="as-people-grid">
                    <div>
                      <h3>Sous-catégories ({selected.categories.length})</h3>
                      <ul className="as-todo as-todo--done">
                        {selected.categories.map((cat) => (
                          <li key={cat.slug} className="is-done">
                            {cat.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Champs spécifiques ({selected.specs.length})</h3>
                      <ul className="as-todo as-todo--done">
                        {selected.specs.map((spec) => (
                          <li key={spec.id} className="is-done">
                            {spec.label}
                            {spec.optional ? " (optionnel)" : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Unités possibles</h3>
                      <p>{selected.units.join(" · ")}</p>
                      <h3 style={{ marginTop: "1rem" }}>Contrôles</h3>
                      <ul className="as-todo as-todo--done">
                        <li className={data.controls.linksOk ? "is-done" : undefined}>Cohérence des liens</li>
                        <li className={data.controls.dependenciesOk ? "is-done" : undefined}>Dépendances</li>
                        <li className={data.controls.visibilityOk ? "is-done" : undefined}>Visibilité</li>
                      </ul>
                      <p className="as-note">
                        Suppression interdite si la catégorie est liée à un article, une location ou un tarif.
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="as-card" style={{ marginTop: "0.85rem" }}>
                <h2>Modifications non publiées</h2>
                {data.unpublished.length === 0 ? (
                  <p className="as-empty">Aucune modification en attente. La taxonomie est versionnée dans le code.</p>
                ) : (
                  <ul className="as-todo">
                    {data.unpublished.map((u) => (
                      <li key={u.id}>
                        {u.label} — {u.impact}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="as-note">{data.lastPublishedNote}</p>
                <div className="as-head__actions" style={{ marginTop: "0.65rem" }}>
                  <button type="button" className="as-btn" onClick={() => setNotice("Prévisualisation des impacts : non ouverte (taxonomie code).")}>
                    Prévisualiser les impacts
                  </button>
                  <button type="button" className="as-btn as-btn--yellow" onClick={() => setNotice("Publication UI désactivée tant que le workflow d’édition n’est pas validé.")}>
                    Publier les modifications
                  </button>
                </div>
              </section>
            </>
          ) : (
            <p>Chargement…</p>
          )}
        </div>
      </div>
    </div>
  );
}

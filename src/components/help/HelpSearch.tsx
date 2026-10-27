"use client";

import Link from "next/link";
import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import { helpContactEscalation } from "@/content/help-center";

export function HelpSearch() {
  const { query, setQuery, clearQuery, resultCount } = useHelpCenter();
  const hasQuery = query.trim().length > 0;
  const noResults = hasQuery && resultCount === 0;

  return (
    <div className="hlp-search">
      <label className="hlp-search__label" htmlFor="hlp-search-input">Rechercher dans le centre d’aide</label>
      <div className="hlp-search__row">
        <input
          id="hlp-search-input"
          type="search"
          className="hlp-search__input"
          placeholder="Rechercher une question, un service ou un équipement…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        {hasQuery ? (
          <button type="button" className="hlp-search__clear" onClick={clearQuery}>
            Effacer
          </button>
        ) : null}
      </div>
      <p className="hlp-search__live" aria-live="polite" aria-atomic="true">
        {hasQuery ? `${resultCount} résultat${resultCount === 1 ? "" : "s"}` : ""}
      </p>
      {noResults ? (
        <div className="hlp-search__empty" role="status">
          <p className="hlp-search__empty-title">Aucune réponse exacte n’a été trouvée.</p>
          <p className="hlp-search__empty-lead">
            Vous pouvez reformuler votre recherche ou contacter ONLOUTOU pour présenter votre situation.
          </p>
          <div className="hlp-search__empty-actions">
            <button type="button" className="hlp-search__empty-btn" onClick={clearQuery}>
              Effacer la recherche
            </button>
            <Link href={helpContactEscalation.primaryCta.href} className="hlp-search__empty-link link-motion">
              Contacter ONLOUTOU
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

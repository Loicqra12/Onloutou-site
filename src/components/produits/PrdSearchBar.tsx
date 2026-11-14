"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PRD_FAMILLES_PATH,
  PRD_VAISSELLE_PATH,
  prdHubCopy,
  prdPlaces,
} from "@/content/produits-hub";
import { patchPrdBasket, usePrdBasket } from "@/lib/produits-basket";
import { PrdControl, PrdDateRange, PrdField } from "@/components/produits/PrdField";
import { PrdArrow } from "@/components/produits/PrdIcons";

const VAISSELLE_HINTS = ["assiette", "assiettes", "verre", "verres", "bol", "bols", "plat", "vaisselle"];

export function PrdSearchBar({
  variant = "hub",
  onQuery,
}: {
  variant?: "hub" | "aisle";
  onQuery?: (query: string) => void;
}) {
  const router = useRouter();
  const basket = usePrdBasket();
  const [query, setQuery] = useState(basket.query);
  const copy = prdHubCopy;

  function persist(nextQuery = query, zone = basket.zone, startDate = basket.startDate, endDate = basket.endDate) {
    patchPrdBasket({ query: nextQuery, zone, startDate, endDate });
  }

  function go(event: React.FormEvent) {
    event.preventDefault();
    persist();
    if (variant === "aisle") {
      onQuery?.(query);
      return;
    }
    const needle = query.trim().toLowerCase();
    const toVaisselle = VAISSELLE_HINTS.some((hint) => needle.includes(hint));
    router.push(toVaisselle ? PRD_VAISSELLE_PATH : PRD_FAMILLES_PATH);
  }

  if (variant === "aisle") {
    return (
      <form className="prd-tools" onSubmit={go}>
        <PrdField id="prd-aisle-query" label="Rechercher dans ce rayon">
          <PrdControl>
            <input
              id="prd-aisle-query"
              value={query}
              placeholder="Assiette, bol, plat de service…"
              onChange={(event) => {
                setQuery(event.target.value);
                onQuery?.(event.target.value);
              }}
            />
          </PrdControl>
        </PrdField>
        <PrdField id="prd-aisle-zone" label="Commune">
          <PrdControl>
            <input
              id="prd-aisle-zone"
              value={basket.zone}
              list="prd-places"
              placeholder="Commune"
              onChange={(event) => persist(query, event.target.value)}
            />
          </PrdControl>
        </PrdField>
        <PrdField label="Dates">
          <PrdDateRange
            startId="prd-aisle-start"
            endId="prd-aisle-end"
            startDate={basket.startDate}
            endDate={basket.endDate}
            onChange={(startDate, endDate) => persist(query, basket.zone, startDate, endDate)}
          />
        </PrdField>
        <datalist id="prd-places">
          {prdPlaces.map((place) => (
            <option key={place} value={place} />
          ))}
        </datalist>
      </form>
    );
  }

  return (
    <form className="prd-search" onSubmit={go} role="search">
      <PrdField id="prd-q" label={copy.searchArticle}>
        <PrdControl>
          <input
            id="prd-q"
            value={query}
            placeholder={copy.searchArticlePh}
            onChange={(event) => setQuery(event.target.value)}
          />
        </PrdControl>
      </PrdField>
      <PrdField id="prd-where" label={copy.searchWhere}>
        <PrdControl>
          <input
            id="prd-where"
            value={basket.zone}
            list="prd-places"
            placeholder={copy.searchWherePh}
            onChange={(event) => persist(query, event.target.value)}
          />
        </PrdControl>
      </PrdField>
      <PrdField label={copy.searchWhen}>
        <PrdDateRange
          startId="prd-when-start"
          endId="prd-when-end"
          startDate={basket.startDate}
          endDate={basket.endDate}
          onChange={(startDate, endDate) => persist(query, basket.zone, startDate, endDate)}
        />
      </PrdField>
      <button type="submit" className="prd-btn prd-btn--yellow">
        {copy.searchSubmit} <PrdArrow />
      </button>
      <datalist id="prd-places">
        {prdPlaces.map((place) => (
          <option key={place} value={place} />
        ))}
      </datalist>
    </form>
  );
}

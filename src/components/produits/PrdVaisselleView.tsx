"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PrdSearchBar } from "@/components/produits/PrdSearchBar";
import { PRD_SUR_MESURE_PATH, catalogById, prdVaisselleCopy } from "@/content/produits-hub";

export function PrdVaisselleView() {
  const [query, setQuery] = useState("");
  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return prdVaisselleCopy.productIds
      .map((id) => catalogById(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .filter((item) => {
        if (!needle) return true;
        return item.keywords.some((word) => word.includes(needle) || needle.includes(word)) || item.title.toLowerCase().includes(needle);
      });
  }, [query]);

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...prdVaisselleCopy.crumb]} />
      <h1 className="prd-h1">{prdVaisselleCopy.title}</h1>
      <p className="prd-lead">{prdVaisselleCopy.lead}</p>
      <PrdSearchBar variant="aisle" onQuery={setQuery} />
      <div className="prd-aisle-grid">
        {products.map((item) => (
          <Link key={item.id} className="prd-aisle-card" href={item.path}>
            <PrdPicture photo={item.photo} />
            <div className="prd-aisle-card__body">
              <span className="prd-aisle-card__kicker">{item.unitBadge}</span>
              <h3>{item.title}</h3>
              <span className="prd-aisle-card__cta">
                {prdVaisselleCopy.seeSheet} <PrdArrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <aside className="prd-band">
        <div>
          <h2>{prdVaisselleCopy.bandTitle}</h2>
          <p>{prdVaisselleCopy.bandLead}</p>
        </div>
        <Link className="prd-btn prd-btn--yellow" href={PRD_SUR_MESURE_PATH}>
          {prdVaisselleCopy.bandCta} <PrdArrow />
        </Link>
      </aside>
    </div>
  );
}

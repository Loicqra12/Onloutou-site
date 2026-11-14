"use client";

import Link from "next/link";
import { useState } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PrdStepper } from "@/components/produits/PrdField";
import {
  PRD_DEMANDE_PATH,
  PRD_ORDINATEUR_PATH,
  PRD_ROOT,
  catalogById,
  prdFicheCopy,
  type PrdCatalogItem,
} from "@/content/produits-hub";
import { addCatalogItem, formatLivePack, usePrdBasket } from "@/lib/produits-basket";

export function PrdProductView({ product }: { product: PrdCatalogItem }) {
  const basket = usePrdBasket();
  const already = basket.items.find((item) => item.id === product.id)?.quantity ?? 0;
  const [qty, setQty] = useState(already || 1);
  const [justAdded, setJustAdded] = useState(false);
  const showCross = product.id === "assiettes-plates-blanches";
  const computer = catalogById("ordinateur-portable");

  function add() {
    addCatalogItem(product.id, qty);
    setJustAdded(true);
  }

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Produits", href: PRD_ROOT },
          { label: product.familyLabel, href: product.family === "reception" ? "/articles/reception" : "/articles/informatique" },
          { label: product.title },
        ]}
      />
      <div className="prd-fiche">
        <PrdPicture photo={product.photo} className="prd-fiche__photo" priority />
        <div>
          <p className="prd-kicker">{product.kicker}</p>
          <h1 className="prd-h1">{product.title}</h1>
          <p className="prd-lead">{product.lead}</p>
          <dl>
            <div className="prd-spec">
              <dt>{product.packagingLabel}</dt>
              <dd>{product.packagingValue}</dd>
            </div>
            <div className="prd-spec prd-spec--qty">
              <dt>{product.unitQtyLabel}</dt>
              <dd style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <PrdStepper label={product.unitQtyLabel} value={qty} onChange={setQty} />
                <span className="prd-live">{formatLivePack({ ...product, quantity: qty })}</span>
              </dd>
            </div>
          </dl>
          <p className="prd-disclaimer">{prdFicheCopy.disclaimer}</p>
          <div className="prd-fiche__actions">
            <button type="button" className="prd-btn prd-btn--yellow" onClick={add}>
              {justAdded ? prdFicheCopy.added : prdFicheCopy.add} <PrdArrow />
            </button>
            <Link className="prd-link" href={PRD_DEMANDE_PATH}>
              {prdFicheCopy.seeRequest} →
            </Link>
          </div>
        </div>
      </div>
      {showCross && computer ? (
        <aside className="prd-band prd-band--cross">
          <PrdPicture photo={computer.photo} />
          <div className="prd-band__copy">
            <h2>{prdFicheCopy.crossTitle}</h2>
            <p>{prdFicheCopy.crossLead}</p>
          </div>
          <Link className="prd-btn prd-btn--white" href={PRD_ORDINATEUR_PATH}>
            {prdFicheCopy.crossCta} <PrdArrow />
          </Link>
        </aside>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdControl, PrdField } from "@/components/produits/PrdField";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PRD_DEMANDE_PATH, catalogById, prdRemiseCopy } from "@/content/produits-hub";
import {
  ingestFamilyBaskets,
  patchPrdBasket,
  usePrdBasket,
  type PrdBasketItem,
  type PrdDeliveryMode,
} from "@/lib/produits-basket";

function photoOf(item: PrdBasketItem) {
  if (item.custom || !item.catalogId) return null;
  return catalogById(item.catalogId)?.photo ?? null;
}

function sortForRemise(items: PrdBasketItem[]) {
  const rank = (item: PrdBasketItem) => {
    if (item.family === "informatique") return 0;
    if (item.family === "reception") return 1;
    if (item.custom) return 2;
    return 3;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

export function PrdRemiseView() {
  const router = useRouter();
  const basket = usePrdBasket();

  useEffect(() => {
    ingestFamilyBaskets();
  }, []);

  function save(event: React.FormEvent) {
    event.preventDefault();
    router.push(PRD_DEMANDE_PATH);
  }

  const modes: [PrdDeliveryMode, string][] = [
    ["livraison", prdRemiseCopy.modeDelivery],
    ["retrait", prdRemiseCopy.modePickup],
    ["convenir", prdRemiseCopy.modeLater],
  ];

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...prdRemiseCopy.crumb]} />
      <span className="prd-kicker-bar" aria-hidden="true" />
      <h1 className="prd-h1">{prdRemiseCopy.title}</h1>
      <p className="prd-lead">{prdRemiseCopy.lead}</p>
      <div className="prd-split" style={{ marginTop: 28 }}>
        <form className="prd-card-form" onSubmit={save}>
          <div className="prd-modes" role="radiogroup" aria-label="Mode de remise">
            {modes.map(([value, label]) => (
              <label key={value} className="prd-mode">
                <input
                  type="radio"
                  name="prd-delivery-mode"
                  value={value}
                  checked={basket.deliveryMode === value}
                  onChange={() => patchPrdBasket({ deliveryMode: value })}
                />
                {label}
              </label>
            ))}
          </div>
          <PrdField id="prd-place" label={prdRemiseCopy.place}>
            <PrdControl>
              <input id="prd-place" value={basket.place} onChange={(event) => patchPrdBasket({ place: event.target.value })} />
            </PrdControl>
          </PrdField>
          <div className="prd-form-grid">
            <PrdField id="prd-delivery-at" label={prdRemiseCopy.deliveryAt}>
              <PrdControl>
                <input
                  id="prd-delivery-at"
                  type="datetime-local"
                  value={basket.deliveryAt}
                  onChange={(event) => patchPrdBasket({ deliveryAt: event.target.value })}
                />
              </PrdControl>
            </PrdField>
            <PrdField id="prd-pickup-at" label={prdRemiseCopy.pickupAt}>
              <PrdControl>
                <input
                  id="prd-pickup-at"
                  type="datetime-local"
                  value={basket.pickupAt}
                  onChange={(event) => patchPrdBasket({ pickupAt: event.target.value })}
                />
              </PrdControl>
            </PrdField>
          </div>
          <PrdField id="prd-access" label={prdRemiseCopy.access}>
            <PrdControl>
              <textarea id="prd-access" value={basket.access} onChange={(event) => patchPrdBasket({ access: event.target.value })} />
            </PrdControl>
          </PrdField>
          <div className="prd-form-actions">
            <Link className="prd-link" href={PRD_DEMANDE_PATH}>
              {prdRemiseCopy.back}
            </Link>
            <button type="submit" className="prd-btn prd-btn--yellow">
              {prdRemiseCopy.save} <PrdArrow />
            </button>
          </div>
        </form>
        <aside className="prd-panel-black">
          <h2>{basket.projectLabel || "Votre demande"}</h2>
          {sortForRemise(basket.items).map((item) => {
            const photo = photoOf(item);
            if (item.custom) {
              return (
                <div key={item.id} className="prd-panel-item prd-panel-item--custom">
                  <h3>{item.title}</h3>
                  <p>
                    {item.quantity} unité{item.quantity > 1 ? "s" : ""} · article décrit par le client
                  </p>
                </div>
              );
            }
            return (
              <div key={item.id} className="prd-panel-item">
                {photo ? <PrdPicture photo={photo} /> : <div />}
                <div>
                  <h3>{item.catalogId === "ordinateur-portable" ? "Ordinateurs portables" : item.catalogId === "assiettes-plates-blanches" ? "Assiettes blanches" : item.title}</h3>
                  <p>
                    {item.unitKind === "lot"
                      ? `${item.quantity} lot${item.quantity > 1 ? "s" : ""} de ${item.packSize}`
                      : `${item.quantity} unité${item.quantity > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="prd-panel-rule" />
          <div className="prd-fees">
            <h3>{prdRemiseCopy.feesTitle}</h3>
            <p>{prdRemiseCopy.feesLead}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

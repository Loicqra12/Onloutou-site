"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdControl, PrdField } from "@/components/produits/PrdField";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PRD_DEMANDE_PATH, prdSurMesureCopy } from "@/content/produits-hub";
import {
  addCustomItem,
  formatItemQty,
  formatPrdLongPeriod,
  ingestFamilyBaskets,
  recapInformatique,
  recapVaisselle,
  usePrdBasket,
} from "@/lib/produits-basket";

export function PrdSurMesureView() {
  const basket = usePrdBasket();
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [details, setDetails] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    ingestFamilyBaskets();
  }, []);

  function add(event: React.FormEvent) {
    event.preventDefault();
    const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);
    if (!title.trim()) return;
    addCustomItem({ title, quantity: qty, details, photoName });
    setAdded(true);
    setTitle("");
    setQuantity("1");
    setDetails("");
    setPhotoName("");
  }

  const infoLine = recapInformatique(basket.items);
  const vaseLine = recapVaisselle(basket.items);
  const period = formatPrdLongPeriod(basket.startDate, basket.endDate);

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...prdSurMesureCopy.crumb]} />
      <span className="prd-kicker-bar" aria-hidden="true" />
      <h1 className="prd-h1">{prdSurMesureCopy.title}</h1>
      <p className="prd-lead">{prdSurMesureCopy.lead}</p>
      <div className="prd-split" style={{ marginTop: 28 }}>
        <form className="prd-card-form" onSubmit={add}>
          <div className="prd-form-grid">
            <PrdField id="prd-sm-title" label={prdSurMesureCopy.article}>
              <PrdControl>
                <input id="prd-sm-title" value={title} onChange={(event) => setTitle(event.target.value)} />
              </PrdControl>
            </PrdField>
            <PrdField id="prd-sm-qty" label={prdSurMesureCopy.quantity}>
              <PrdControl>
                <input
                  id="prd-sm-qty"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </PrdControl>
            </PrdField>
          </div>
          <PrdField id="prd-sm-details" label={prdSurMesureCopy.details}>
            <PrdControl>
              <textarea id="prd-sm-details" value={details} onChange={(event) => setDetails(event.target.value)} />
            </PrdControl>
          </PrdField>
          <label className="prd-field">
            <span className="prd-field__label">{prdSurMesureCopy.photo}</span>
            <span className="prd-field__control prd-file">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")}
              />
              <span className="prd-file__cta">+ {prdSurMesureCopy.photoCta}{photoName ? ` · ${photoName}` : ""}</span>
            </span>
          </label>
          <div className="prd-form-actions">
            <button type="submit" className="prd-btn prd-btn--yellow">
              {added ? "Ajouté à ma demande" : prdSurMesureCopy.add} <PrdArrow />
            </button>
            <Link className="prd-link" href={PRD_DEMANDE_PATH}>
              {prdSurMesureCopy.continue}
            </Link>
          </div>
        </form>
        <aside className="prd-side">
          <PrdPicture photo="surMesure" />
          <div className="prd-side__body">
            <h2>{prdSurMesureCopy.sideTitle}</h2>
            {basket.projectLabel ? <h3>{basket.projectLabel}</h3> : null}
            <ul>
              {infoLine ? <li>{infoLine}</li> : null}
              {vaseLine ? <li>{vaseLine}</li> : null}
              {basket.items
                .filter((item) => item.custom)
                .map((item) => (
                  <li key={item.id}>
                    {item.title} · {formatItemQty(item)}
                  </li>
                ))}
            </ul>
            {period ? <p className="prd-meta">{period}</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

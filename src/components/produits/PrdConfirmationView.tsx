"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdArrow, PrdArrowOut } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PRD_ROOT, prdConfirmationCopy } from "@/content/produits-hub";
import {
  formatPrdShortPeriod,
  readConfirmationSnapshot,
  recapInformatique,
  recapVaisselle,
  type PrdConfirmationSnapshot,
} from "@/lib/produits-basket";

export function PrdConfirmationView() {
  const [snapshot, setSnapshot] = useState<PrdConfirmationSnapshot | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique depuis sessionStorage
    setSnapshot(readConfirmationSnapshot());
  }, []);

  const place = snapshot?.zone?.trim() || snapshot?.place?.trim() || "";
  const dates = snapshot ? formatPrdShortPeriod(snapshot.startDate, snapshot.endDate) : "";
  const lieu = [place, dates].filter(Boolean).join(" \u00b7 ");
  const vaisselle = snapshot ? recapVaisselle(snapshot.items) : "";
  const info = snapshot ? recapInformatique(snapshot.items) : "";
  const customs = snapshot?.items.filter((item) => item.custom) ?? [];
  const refLabel = snapshot?.referenceKind === "api" ? prdConfirmationCopy.apiLabel : prdConfirmationCopy.demoLabel;
  const reference = snapshot?.reference ?? "";

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...prdConfirmationCopy.crumb]} />
      <section className="prd-confirm-hero" aria-labelledby="prd-confirm-title">
        <div className="prd-confirm-hero__copy">
          <span className="prd-kicker-bar" aria-hidden="true" />
          <h1 id="prd-confirm-title" className="prd-h1">
            {prdConfirmationCopy.title}
          </h1>
          {reference ? (
            <>
              <p className="prd-ref-label">{refLabel}</p>
              <p className="prd-ref">{reference}</p>
            </>
          ) : null}
          <p className="prd-lead">{prdConfirmationCopy.lead}</p>
          <Link className="prd-btn prd-btn--yellow" href={PRD_ROOT}>
            {prdConfirmationCopy.back} <PrdArrow />
          </Link>
        </div>
        <PrdPicture photo="confirmation" className="prd-hero__photo" priority />
      </section>
      <section className="prd-recap" aria-labelledby="prd-recap-title">
        <h2 id="prd-recap-title" className="prd-h2">
          {prdConfirmationCopy.recapTitle}
        </h2>
        <dl className="prd-recap__grid" style={customs.length ? { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } : undefined}>
          <div>
            <dt>{prdConfirmationCopy.recapPlace}</dt>
            <dd>{lieu}</dd>
          </div>
          <div>
            <dt>{prdConfirmationCopy.recapVaisselle}</dt>
            <dd>{vaisselle}</dd>
          </div>
          <div>
            <dt>{prdConfirmationCopy.recapInfo}</dt>
            <dd>{info}</dd>
          </div>
          {customs.map((item) => (
            <div key={item.id}>
              <dt>{prdConfirmationCopy.recapCustom}</dt>
              <dd>
                {item.title}{" · "}{item.quantity} unit{"é"}{item.quantity > 1 ? "s" : ""}
              </dd>
            </div>
          ))}
        </dl>
        <p className="prd-partner">
          <span>{prdConfirmationCopy.partnerAsk}</span>
          <Link href={prdConfirmationCopy.partnerHref}>
            {prdConfirmationCopy.partnerCta} <PrdArrowOut />
          </Link>
        </p>
      </section>
    </div>
  );
}

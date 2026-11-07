"use client";

import Image from "next/image";
import { temProducts, temImage, temRequestBar } from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemIcon } from "./TemIcon";

export function TemBar() {
  const t = useTem();
  const count = t.named.length;
  const first = t.named.find((i) => i.productId);
  const product = first ? temProducts.find((p) => p.id === first.productId) : undefined;
  return (
    <div className="tem-bar-wrap">
      <aside className="tem-bar" aria-label={temRequestBar.label}>
        <span className="tem-bar__thumb">
          {product ? (
            <Image src={temImage(product.image)} alt="" width={64} height={48} className="tem-bar__img" />
          ) : (
            <TemIcon name="box" strokeWidth={1.4} />
          )}
        </span>
        <p className="tem-bar__text" role="status" aria-live="polite">
          <strong>
            {temRequestBar.label}
            {count ? <> &nbsp;•&nbsp; {count} équipement{count > 1 ? "s" : ""}</> : null}
          </strong>
          <span>{count ? t.named.map((i) => i.name.trim()).join(", ") : temRequestBar.empty}</span>
        </p>
        <a
          href="#demande-materiel"
          className="tem-btn tem-btn--yellow"
          onClick={(e) => {
            e.preventDefault();
            t.scrollTo("demande-materiel");
          }}
        >
          {temRequestBar.next}
          <TemIcon name="arrowRight" strokeWidth={2} />
        </a>
      </aside>
    </div>
  );
}

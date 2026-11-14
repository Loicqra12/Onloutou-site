import type { Metadata } from "next";
import Link from "next/link";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PrdSearchBar } from "@/components/produits/PrdSearchBar";
import { PRD_FAMILLES_PATH, prdHubCopy } from "@/content/produits-hub";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.hub;

export default function ProduitsPage() {
  const copy = prdHubCopy;
  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...copy.crumb]} />
      <section className="prd-hero" aria-labelledby="prd-hero-title">
        <div className="prd-hero__copy">
          <span className="prd-kicker-bar" aria-hidden="true" />
          <h1 id="prd-hero-title" className="prd-h1">
            {copy.title}
          </h1>
          <p className="prd-lead">{copy.lead}</p>
          <div>
            <Link className="prd-btn prd-btn--black" href={PRD_FAMILLES_PATH}>
              {copy.explore} <PrdArrow />
            </Link>
          </div>
        </div>
        <PrdPicture photo="heroHub" className="prd-hero__photo" priority />
      </section>
      <PrdSearchBar />
      <section className="prd-univers" aria-labelledby="prd-univers-title">
        <h2 id="prd-univers-title" className="prd-h2">
          {copy.universTitle}
        </h2>
        <div className="prd-univers__grid">
          {copy.univers.map((item) => (
            <Link key={item.id} className="prd-uni-card" href={item.href}>
              <PrdPicture photo={item.photo} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

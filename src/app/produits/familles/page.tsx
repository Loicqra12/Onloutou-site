import type { Metadata } from "next";
import Link from "next/link";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import { PRD_SUR_MESURE_PATH, prdFamillesCopy, prdFamilyGroups } from "@/content/produits-hub";
import { prdPageSeo } from "@/content/produits-seo";

export const metadata: Metadata = prdPageSeo.familles;

export default function ProduitsFamillesPage() {
  const copy = prdFamillesCopy;
  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...copy.crumb]} />
      <h1 className="prd-h1">{copy.title}</h1>
      {prdFamilyGroups.map((group) => (
        <section key={group.id} id={group.id} className="prd-group" aria-labelledby={`prd-group-${group.id}`}>
          <h2 id={`prd-group-${group.id}`}>{group.title}</h2>
          <div className="prd-family-grid">
            {group.items.map((item) => (
              <Link key={item.href} className="prd-family-card" href={item.href}>
                <PrdPicture photo={item.photo} />
                <div className="prd-family-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <aside className="prd-band">
        <div>
          <h2>{copy.otherTitle}</h2>
          <p>{copy.otherLead}</p>
        </div>
        <Link className="prd-btn prd-btn--yellow" href={PRD_SUR_MESURE_PATH}>
          {copy.otherCta} <PrdArrow />
        </Link>
      </aside>
    </div>
  );
}

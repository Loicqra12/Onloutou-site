import Link from "next/link";
import { homeOfferArticles } from "@/content/devenir-partenaire";
import "@/styles/partner-space.css";

export function HomOfferArticles() {
  return (
    <section className="hom-offer" id="proposer-mes-articles" aria-labelledby="hom-offer-title">
      <div className="hom-offer__inner">
        <div>
          <h2 id="hom-offer-title">{homeOfferArticles.title}</h2>
          <p>{homeOfferArticles.lead}</p>
        </div>
        <Link href={homeOfferArticles.cta.href} className="ps-btn ps-btn--yellow">
          {homeOfferArticles.cta.label}
        </Link>
      </div>
    </section>
  );
}

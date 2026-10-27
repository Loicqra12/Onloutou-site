import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesBuyRentComparison } from "@/content/sales-page";

export function BuyOrRentComparison() {
  return (
    <section className="sales-compare section-spacing" aria-labelledby="sales-compare-title">
      <div className="container-content">
        <Reveal>
          <p className="sales-eyebrow">Choisir la bonne approche</p>
          <TitleReveal as="h2" id="sales-compare-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            <MarkedPhrase text={salesBuyRentComparison.title} highlight={salesBuyRentComparison.titleHighlight} />
          </TitleReveal>
        </Reveal>

        <div className="sales-compare__columns">
          <article className="sales-compare__column">
            <p className="sales-compare__column-kicker">Acquisition</p>
            <h3 className="sales-compare__column-title">{salesBuyRentComparison.rows[0].buy}.</h3>
            <ul>
              {salesBuyRentComparison.rows.map((row) => (
                <li key={row.criterion}>
                  <span>{row.criterion}</span>
                  {row.buy}
                </li>
              ))}
            </ul>
            <Button href="#demande-equipement" variant="primary">
              Décrire mon besoin
            </Button>
          </article>
          <article className="sales-compare__column">
            <p className="sales-compare__column-kicker">Location</p>
            <h3 className="sales-compare__column-title">{salesBuyRentComparison.rows[0].rent}.</h3>
            <ul>
              {salesBuyRentComparison.rows.map((row) => (
                <li key={row.criterion}>
                  <span>{row.criterion}</span>
                  {row.rent}
                </li>
              ))}
            </ul>
            <Link href="/solutions/location" className="sales-compare__link link-motion">
              Découvrir la location
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

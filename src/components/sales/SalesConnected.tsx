import Image from "next/image";
import Link from "next/link";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesConnected, salesMedia } from "@/content/sales-page";

export function SalesConnected() {
  const photo = salesMedia.traceur;

  return (
    <section className="sales-connected" aria-labelledby="sales-connected-title">
      <div className="sales-connected__media">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 767px) 190vw, 100vw" quality={86}
          className="sales-connected__bg"
          style={{ objectFit: "cover", objectPosition: photo.objectPosition }}
        />
      </div>
      <div className="sales-connected__veil" aria-hidden />
      <div className="container-content sales-connected__inner">
        <p className="sales-connected__kicker">Équipements connectés</p>
        <TitleReveal as="h2" id="sales-connected-title" className="sales-connected__title font-display font-extrabold tracking-tight">
          <MarkedPhrase text={salesConnected.title} highlight={salesConnected.titleHighlight} />
        </TitleReveal>
        <p className="sales-connected__lead">{salesConnected.lead}</p>
        <ul className="sales-connected__points">
          {salesConnected.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="sales-connected__links">
          {salesConnected.links.map((link) => (
            <Link key={link.href} href={link.href} className="sales-connected__link link-motion">
              {link.label}
              <span aria-hidden> ↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

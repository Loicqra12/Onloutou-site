import Image from "next/image";
import { homPartners } from "@/content/home-hub";
import { historicalReferenceLogos } from "@/content/media";

/** Références déjà présentées sur l'accueil et associées à la géolocalisation (mêmes logos, mêmes libellés). */
const GEOLOCATION_REFERENCE_IDS = ["banque-atlantique", "bni"] as const;

export function GlxReferences() {
  const logos = historicalReferenceLogos.filter(
    (logo) =>
      (GEOLOCATION_REFERENCE_IDS as readonly string[]).includes(logo.id) && homPartners.labels[logo.id] === "Géolocalisation",
  );
  if (logos.length === 0) return null;

  return (
    <section className="glx-section glx-references" aria-labelledby="glx-references-title">
      <div className="glx-wrap">
        <p className="glx-kicker">Références</p>
        <h2 id="glx-references-title" className="glx-h2 glx-h2--md">
          Des références en géolocalisation.
        </h2>
        <ul className="glx-references__list">
          {logos.map((logo) => (
            <li key={logo.id} className="glx-references__item">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.visualMaxWidth ?? logo.width}
                height={logo.visualMaxHeight ?? logo.height}
                sizes="140px"
                className="glx-references__logo"
              />
              <span>{logo.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

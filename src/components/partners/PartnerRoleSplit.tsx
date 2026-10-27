import Link from "next/link";
import { partnersRoleSplit } from "@/content/partners-page";

export function PartnerRoleSplit() {
  const { partner, delivery } = partnersRoleSplit;

  return (
    <section className="partners-roles section-spacing" aria-labelledby="partners-roles-title">
      <div className="container-content">
        <h2 id="partners-roles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {partnersRoleSplit.title}
        </h2>
      </div>
      <div className="partners-roles__split">
        <div className="partners-roles__zone partners-roles__zone--partner">
          <h3>{partner.title}</h3>
          <p className="partners-roles__def">{partner.definition}</p>
          <p className="partners-roles__list-label">Informations pouvant être demandées</p>
          <ul>
            {partner.info.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="partners-roles__divider" aria-hidden />
        <div className="partners-roles__zone partners-roles__zone--delivery">
          <h3>{delivery.title}</h3>
          <p className="partners-roles__def">{delivery.definition}</p>
          <p className="partners-roles__list-label">Informations pouvant être demandées</p>
          <ul>
            {delivery.info.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {delivery.hubLink && (
            <p className="partners-roles__hub">
              <Link href={delivery.hubLink.href} className="link-motion">{delivery.hubLink.label}</Link>
            </p>
          )}
        </div>
      </div>
      <p className="partners-roles__disclaimer container-content">{partnersRoleSplit.disclaimer}</p>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentConnected } from "@/content/equipment-page";

export function ConnectedEquipmentSection() {
  return (
    <section className="equip-connected section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="equip-connected-title">
      <div className="container-content">
        <Reveal>
          <h2 id="equip-connected-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {equipmentConnected.title}
          </h2>
          <p className="equip-connected__lead">{equipmentConnected.lead}</p>
        </Reveal>

        <p className="sr-only">
          Parcours : équipement, dispositif, connectivité, plateforme, équipe — étapes reliées séquentiellement.
        </p>

        <ol className="equip-connected__flow">
          {equipmentConnected.flow.map((step, index) => (
            <li key={step}>
              <span className="equip-connected__step">{step}</span>
              {index < equipmentConnected.flow.length - 1 && (
                <span className="equip-connected__arrow" aria-hidden>→</span>
              )}
            </li>
          ))}
        </ol>

        <ul className="equip-connected__considerations">
          {equipmentConnected.considerations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="equip-connected__links">
          {equipmentConnected.links.map((link) => (
            <Link key={link.href} href={link.href} className="equip-connected__link link-motion">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

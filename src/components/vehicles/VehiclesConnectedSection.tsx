import Link from "next/link";
import { vehiclesConnected } from "@/content/vehicles-page";

export function VehiclesConnectedSection() {
  const data = vehiclesConnected;

  return (
    <section className="veh-connected section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="veh-connected-title">
      <div className="container-content">
        <h2 id="veh-connected-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="veh-connected__lead">{data.lead}</p>

        <p className="sr-only">Parcours : véhicule, dispositif, transmission, plateforme, équipe.</p>
        <ol className="veh-connected__flow">
          {data.flow.map((step, index) => (
            <li key={step}>
              <span className="veh-connected__node">{step}</span>
              {index < data.flow.length - 1 && <span className="veh-connected__wire" aria-hidden />}
            </li>
          ))}
        </ol>

        <p className="veh-connected__disclaimer">{data.disclaimer}</p>

        <div className="veh-connected__links">
          {data.links.map((link) => (
            <Link key={link.href} href={link.href} className="veh-connected__link link-motion">{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

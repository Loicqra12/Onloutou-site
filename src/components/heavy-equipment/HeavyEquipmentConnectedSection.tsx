import Link from "next/link";
import { trucksMachineryConnected } from "@/content/trucks-machinery-page";

export function HeavyEquipmentConnectedSection() {
  const data = trucksMachineryConnected;

  return (
    <section className="heq-connected section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="heq-connected-title">
      <div className="container-content">
        <h2 id="heq-connected-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="heq-connected__lead">{data.lead}</p>
        <ol className="heq-connected__flow" aria-label="Schéma : du matériel à l’équipe">
          {data.flow.map((node, index) => (
            <li key={node} className="heq-connected__flow-item">
              <span className="heq-connected__node">{node}</span>
              {index < data.flow.length - 1 && <span className="heq-connected__wire" aria-hidden />}
            </li>
          ))}
        </ol>
        <ul className="heq-connected__considerations">
          {data.considerations.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <div className="heq-connected__links">
          {data.links.map((link) => (
            <Link key={link.href} href={link.href} className="heq-connected__link link-motion">{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

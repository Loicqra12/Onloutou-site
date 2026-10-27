import Link from "next/link";
import { motorcyclesConnected } from "@/content/motorcycles-page";

export function MotorcyclesConnectedSection() {
  const data = motorcyclesConnected;

  return (
    <section className="mot-connected section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="mot-connected-title">
      <div className="container-content">
        <h2 id="mot-connected-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="mot-connected__lead">{data.lead}</p>

        <ol className="mot-connected__flow">
          {data.flow.map((step, index) => (
            <li key={step}>
              <span className="mot-connected__node">{step}</span>
              {index < data.flow.length - 1 && <span className="mot-connected__wire" aria-hidden />}
            </li>
          ))}
        </ol>

        <ul className="mot-connected__considerations">
          {data.considerations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mot-connected__links">
          {data.links.map((link) => (
            <Link key={link.href} href={link.href} className="mot-connected__link link-motion">{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

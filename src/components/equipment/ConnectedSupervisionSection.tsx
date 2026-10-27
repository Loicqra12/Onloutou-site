import Image from "next/image";
import Link from "next/link";
import { connectedEquipmentMedia, connectedSupervisionSection } from "@/content/connected-equipment-page";

export function ConnectedSupervisionSection() {
  const data = connectedSupervisionSection;
  const primary = connectedEquipmentMedia.dashboardGeo;
  const secondary = connectedEquipmentMedia.dashboardSupervision;

  return (
    <section className="cec-dash section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="cec-dash-title">
      <div className="container-content">
        <h2 id="cec-dash-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="cec-dash__functions">
          {data.functions.map((fn) => (
            <li key={fn}>{fn}</li>
          ))}
        </ul>
        <div className="cec-dash__composition">
          <figure className="cec-dash__primary">
            <Image
              src={primary.src}
              alt={primary.alt}
              width={primary.width}
              height={primary.height}
              sizes="(max-width: 1023px) 100vw, 640px"
              className="cec-dash__img"
            />
            <figcaption>
              <span className="cec-dash__badge">{data.demoLabel}</span>
              <span className="cec-dash__data-note">{data.dataLabel}</span>
            </figcaption>
          </figure>
          <figure className="cec-dash__secondary">
            <Image
              src={secondary.src}
              alt={secondary.alt}
              width={secondary.width}
              height={secondary.height}
              sizes="(max-width: 1023px) 70vw, 420px"
              className="cec-dash__img"
            />
            <figcaption>
              <span className="cec-dash__badge">{data.demoLabel}</span>
            </figcaption>
          </figure>
        </div>
        <div className="cec-dash__links">
          {data.links.map((link) => (
            <Link key={link.href} href={link.href} className="cec-dash__link link-motion">{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

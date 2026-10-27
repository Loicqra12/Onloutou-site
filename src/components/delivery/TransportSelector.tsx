"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import {
  deliveryPageMedia,
  deliveryTransportOptions,
  type DeliveryTransportId,
} from "@/content/delivery-page";

export function TransportSelector() {
  const data = deliveryTransportOptions;
  const [activeId, setActiveId] = useState<DeliveryTransportId>(data.items[0].id);
  const active = data.items.find((item) => item.id === activeId) ?? data.items[0];
  const photo = deliveryPageMedia.mobilityCourtyard;

  return (
    <section className="dlv-transport section-spacing bg-brand-paper" aria-labelledby="dlv-transport-title">
      <div className="container-content dlv-transport__layout">
        <div>
          <Reveal>
            <h2 id="dlv-transport-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {data.title}
            </h2>
          </Reveal>
          <div className="dlv-transport__nav" role="tablist" aria-label="Moyens de transport à étudier">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`dlv-transport-tab-${item.id}`}
                aria-selected={activeId === item.id}
                aria-controls={`dlv-transport-panel-${item.id}`}
                className={`dlv-transport__tab${activeId === item.id ? " dlv-transport__tab--active" : ""}`}
                onClick={() => setActiveId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            id={`dlv-transport-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`dlv-transport-tab-${active.id}`}
            className="dlv-transport__panel"
          >
            {active.specialText ? (
              <p className="dlv-transport__special">{active.specialText}</p>
            ) : (
              <>
                <p className="dlv-transport__label">Peut être étudié pour :</p>
                <ul>
                  {active.studiedFor.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="dlv-transport__tag">{active.note}</p>
            <p className="dlv-transport__disclaimer">
              Aucun véhicule n’est garanti pour votre livraison sans qualification préalable.
            </p>
          </div>
        </div>
        <Reveal delay={80} className="dlv-transport__visual editorial-media">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="dlv-transport__img editorial-media__img"
              style={{ objectPosition: photo.objectPosition }}
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

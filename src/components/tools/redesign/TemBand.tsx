"use client";

import { temWhatsappBand } from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemIcon } from "./TemIcon";

export function TemBand() {
  const t = useTem();
  return (
    <section className="tem-band-wrap" aria-labelledby="tem-band-title">
      <div className="tem-wrap">
        <div className="tem-band">
          <TemIcon name="headset" strokeWidth={1.4} className="tem-band__icon" />
          <p>
            <strong id="tem-band-title">{temWhatsappBand.title}</strong>
            <span>{temWhatsappBand.text}</span>
          </p>
          <a href={t.whatsappUrl} className="tem-btn tem-btn--black" target="_blank" rel="noopener noreferrer">
            <TemIcon name="whatsapp" />
            {temWhatsappBand.cta}
            <TemIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

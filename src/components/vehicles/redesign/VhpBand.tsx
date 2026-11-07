"use client";

import { vhpBand } from "@/content/vehicles-hub";
import { useVhp } from "./VhpContext";
import { VhpIcon } from "./VhpIcon";

export function VhpBand() {
  const t = useVhp();
  return (
    <section className="vhp-bandwrap" aria-labelledby="vhp-band-title">
      <div className="vhp-wrap">
        <div className="vhp-band">
          <VhpIcon name="truck" strokeWidth={1.4} className="vhp-band__icon" />
          <p id="vhp-band-title">{vhpBand.title}</p>
          <a href={t.whatsappUrl} className="vhp-btn vhp-btn--black" target="_blank" rel="noopener noreferrer">
            {vhpBand.cta}
            <VhpIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

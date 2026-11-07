"use client";

import { mopBand } from "@/content/motos-hub";
import { useMop } from "./MopContext";
import { MopIcon } from "./MopIcon";

export function MopBand() {
  const t = useMop();
  return (
    <section className="mop-bandwrap" aria-labelledby="mop-band-title">
      <div className="mop-wrap">
        <div className="mop-band">
          <MopIcon name="chatLines" strokeWidth={1.4} className="mop-band__icon" />
          <p>
            <strong id="mop-band-title">{mopBand.title}</strong>
            <span>{mopBand.text}</span>
          </p>
          <a href={t.whatsappUrl} className="mop-btn mop-btn--black" target="_blank" rel="noopener noreferrer">
            {mopBand.cta}
            <MopIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

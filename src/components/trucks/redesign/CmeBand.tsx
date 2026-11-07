"use client";

import { cmeBand } from "@/content/trucks-hub";
import { useCme } from "./CmeContext";
import { CmeIcon } from "./CmeIcon";

export function CmeBand() {
  const t = useCme();
  return (
    <section className="cme-bandwrap" aria-labelledby="cme-band-title">
      <div className="cme-wrap">
        <div className="cme-band">
          <CmeIcon name="chat" strokeWidth={1.4} className="cme-band__icon" />
          <p id="cme-band-title">
            <strong>{cmeBand.title}</strong>
            {cmeBand.text}
          </p>
          <a href={t.whatsappUrl} className="cme-btn cme-btn--black" target="_blank" rel="noopener noreferrer">
            {cmeBand.cta}
            <CmeIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

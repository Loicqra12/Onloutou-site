"use client";

import { cnxBand } from "@/content/connected-hub";
import { useCnx } from "./CnxContext";
import { CnxIcon } from "./CnxIcon";

export function CnxBand() {
  const t = useCnx();
  return (
    <section className="cnx-bandwrap" aria-labelledby="cnx-band-title">
      <div className="cnx-band">
        <div className="cnx-wrap cnx-band__inner">
          <p>
            <strong id="cnx-band-title">{cnxBand.title}</strong>
            <span>{cnxBand.text}</span>
          </p>
          <a href={t.whatsappUrl} className="cnx-btn cnx-btn--black" target="_blank" rel="noopener noreferrer">
            {cnxBand.cta}
            <CnxIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { phCopy } from "@/content/partner-locations";
import { pdPaths } from "@/content/partner-demands";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaSect } from "@/components/partners/PaField";
import "@/styles/partner-articles.css";
import "@/styles/partner-demands.css";

export function PartnerHelp() {
  return (
    <div className="pa">
      <div className="pa-head">
        <div>
          <h1>{phCopy.title}</h1>
          <p>{phCopy.lead}</p>
        </div>
      </div>
      <div className="pa-grid">
        <div>
          {phCopy.items.map((item) => (
            <section className="pa-card" key={item.q} style={{ marginBottom: "0.65rem" }}>
              <PaSect icon="help">{item.q}</PaSect>
              <p style={{ margin: 0 }}>{item.a}</p>
            </section>
          ))}
        </div>
        <aside className="pa-aside">
          <PaSect icon="mail">{phCopy.contact}</PaSect>
          <p>{phCopy.contactText}</p>
          <Link href={pdPaths.contact} className="pa-btn pa-btn--yellow" style={{ marginTop: "0.7rem" }}>
            <DpIcon name="mail" /> {phCopy.contact} →
          </Link>
        </aside>
      </div>
    </div>
  );
}

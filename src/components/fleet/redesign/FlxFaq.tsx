"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { flxFaq } from "@/content/fleet-hub";
import { FlxIcon } from "./FlxIcon";

export function FlxFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="flx-section flx-faq" aria-labelledby="flx-faq-title">
      <div className="flx-wrap flx-faq__grid">
        <div className="flx-faq__intro">
          <p className="flx-kicker">{flxFaq.kicker}</p>
          <h2 id="flx-faq-title" className="flx-h2">
            {flxFaq.titleLines.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
          </h2>
          <p className="flx-lead">{flxFaq.lead}</p>
          <Link href={flxFaq.cta.href} className="flx-btn flx-btn--yellow">
            {flxFaq.cta.label}
            <FlxIcon name="arrowUpRight" />
          </Link>
        </div>
        <ul className="flx-faq__list">
          {flxFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={isOpen ? "is-open" : undefined}>
                <h3>
                  <button
                    type="button"
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.question}</span>
                    <FlxIcon name={isOpen ? "minus" : "plus"} strokeWidth={2} />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="flx-faq__answer">
                  <p>{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

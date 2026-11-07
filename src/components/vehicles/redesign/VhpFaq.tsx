"use client";

import { useId, useState } from "react";
import { vhpFaq } from "@/content/vehicles-hub";
import { VhpIcon } from "./VhpIcon";

export function VhpFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="vhp-section vhp-faq" aria-labelledby="vhp-faq-title">
      <div className="vhp-wrap">
        <h2 id="vhp-faq-title" className="vhp-h2 vhp-h2--xs">
          {vhpFaq.title}
        </h2>
        <ul className="vhp-faq__list">
          {vhpFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={isOpen ? "is-open" : undefined}>
                <h3>
                  <button type="button" id={`${uid}-q${i}`} aria-expanded={isOpen} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{item.question}</span>
                    <VhpIcon name={isOpen ? "chevronUp" : "chevronDown"} strokeWidth={2} />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className={isOpen ? "vhp-faq__answer" : "vhp-faq__answer is-closed"}>
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

"use client";

import { useId, useState } from "react";
import { cmeFaq } from "@/content/trucks-hub";
import { CmeIcon } from "./CmeIcon";

export function CmeFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="cme-section cme-faq" aria-labelledby="cme-faq-title">
      <div className="cme-wrap">
        <h2 id="cme-faq-title" className="cme-h2 cme-h2--xs">
          <span className="cme-underline">{cmeFaq.title.slice(0, 9)}</span>
          {cmeFaq.title.slice(9)}
        </h2>
        <ul className="cme-faq__list">
          {cmeFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={isOpen ? "is-open" : undefined}>
                <h3>
                  <button type="button" id={`${uid}-q${i}`} aria-expanded={isOpen} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <CmeIcon name="help" strokeWidth={1.6} className="cme-faq__q" />
                    <span className="cme-faq__text">{item.question}</span>
                    <CmeIcon name={isOpen ? "chevronUp" : "chevronDown"} strokeWidth={2} className="cme-faq__chev" />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className={isOpen ? "cme-faq__answer" : "cme-faq__answer is-closed"}>
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

"use client";

import { useId, useState } from "react";
import { temFaq } from "@/content/tools-hub";
import { TemIcon } from "./TemIcon";

export function TemFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="tem-section tem-faq" aria-labelledby="tem-faq-title">
      <div className="tem-wrap">
        <h2 id="tem-faq-title" className="tem-h2 tem-h2--sm">
          <span className="tem-underline">{temFaq.title[0]}</span>
          {temFaq.title[1]}
        </h2>
        <ul className="tem-faq__list">
          {temFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={isOpen ? "is-open" : undefined}>
                <h3>
                  <button type="button" id={`${uid}-q${i}`} aria-expanded={isOpen} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{item.question}</span>
                    <TemIcon name={isOpen ? "minus" : "plus"} strokeWidth={2} />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="tem-faq__answer">
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

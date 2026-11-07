"use client";

import { useId, useState } from "react";
import { mopFaq } from "@/content/motos-hub";
import { MopIcon } from "./MopIcon";

export function MopFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mop-section mop-faq" aria-labelledby="mop-faq-title">
      <div className="mop-wrap">
        <h2 id="mop-faq-title" className="mop-h2 mop-h2--xs">
          {mopFaq.title}
        </h2>
        <ul className="mop-faq__list">
          {mopFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={isOpen ? "is-open" : undefined}>
                <h3>
                  <button type="button" id={`${uid}-q${i}`} aria-expanded={isOpen} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="mop-faq__num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="mop-faq__q">{item.question}</span>
                    <MopIcon name={isOpen ? "chevronUp" : "chevronDown"} strokeWidth={2} />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className={isOpen ? "mop-faq__answer" : "mop-faq__answer is-closed"}>
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

"use client";

import { useId, useState } from "react";
import { secFaq } from "@/content/security-hub";
import { SecIcon } from "./SecIcon";

export function SecFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id={secFaq.id} className="sec-section sec-faq" aria-labelledby="sec-faq-title">
      <div className="sec-wrap sec-faq__grid">
        <div className="sec-faq__intro">
          <p className="sec-kicker">{secFaq.kicker}</p>
          <h2 id="sec-faq-title" className="sec-h2">
            {secFaq.titleLines.map((l) => (
              <span key={l} className="sec-line">
                {l}
              </span>
            ))}
            <span className="sec-line">
              <span className="sec-underline">{secFaq.titleUnderline}</span>
            </span>
          </h2>
          <p className="sec-lead">{secFaq.lead}</p>
        </div>
        <ul className="sec-faq__list">
          {secFaq.items.map((item, i) => {
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
                    <span className="sec-faq__toggle">
                      <SecIcon name={isOpen ? "minus" : "plus"} strokeWidth={2.4} />
                    </span>
                    <span>{item.question}</span>
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="sec-faq__answer">
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

"use client";

import { useId, useState } from "react";
import { eqpFaq } from "@/content/equipment-hub";
import { EqpIcon } from "./EqpIcon";

export function EqpFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="eqp-section eqp-faq" aria-labelledby="eqp-faq-title">
      <div className="eqp-wrap eqp-faq__grid">
        <h2 id="eqp-faq-title" className="eqp-h2 eqp-h2--lg">
          {eqpFaq.titleLines.map((line, i) => (
            <span key={line} className="eqp-line">
              {line}
              {i === eqpFaq.titleLines.length - 1 ? <span className="eqp-dot" aria-hidden="true">.</span> : null}
            </span>
          ))}
        </h2>
        <ul className="eqp-faq__list">
          {eqpFaq.items.map((item, i) => {
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
                    <EqpIcon name={isOpen ? "minus" : "plus"} strokeWidth={2} />
                    <span>{item.question}</span>
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="eqp-faq__answer">
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

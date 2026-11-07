"use client";

import { useId, useState } from "react";
import { psmFaq } from "@/content/platform-page";
import { PsmIcon } from "./PsmIcon";

export function PsmFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="psm-section psm-section--white psm-faq" aria-labelledby="psm-faq-title">
      <div className="psm-wrap psm-faq-grid">
        <div>
          <p className="psm-kicker">{psmFaq.kicker}</p>
          <h2 id="psm-faq-title" className="psm-h2">
            {psmFaq.titleLines.map((line) => (
              <span key={line} className="psm-line">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <div>
          <ul className="psm-faq-list">
            {psmFaq.items.map((item, i) => {
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
                      <PsmIcon name={isOpen ? "minus" : "plus"} strokeWidth={2.2} />
                    </button>
                  </h3>
                  <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="psm-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="psm-faq-note">{psmFaq.note}</p>
        </div>
      </div>
    </section>
  );
}

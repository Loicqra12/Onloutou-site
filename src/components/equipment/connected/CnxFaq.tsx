"use client";

import { useId, useState } from "react";
import { cnxFaq } from "@/content/connected-hub";
import { CnxIcon } from "./CnxIcon";
import { CnxSolutions } from "./CnxStatic";

export function CnxFaqSolutions() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="cnx-section cnx-faqsol" aria-label="Questions fréquentes et solutions associées">
      <div className="cnx-wrap cnx-faqsol__grid">
        <div className="cnx-faq" aria-labelledby="cnx-faq-title">
          <h2 id="cnx-faq-title" className="cnx-h2 cnx-h2--xs cnx-h2--bar">
            {cnxFaq.title}
          </h2>
          <ul className="cnx-faq__list">
            {cnxFaq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.question}>
                  <h3>
                    <button type="button" id={`${uid}-q${i}`} aria-expanded={isOpen} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                      <span>{item.question}</span>
                      <CnxIcon name={isOpen ? "minus" : "plus"} strokeWidth={2} />
                    </button>
                  </h3>
                  <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className={isOpen ? "cnx-faq__answer" : "cnx-faq__answer is-closed"}>
                    <p>{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <CnxSolutions />
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ptnFaq } from "@/content/partners-hub";
import type { PtnFaqContent } from "@/content/partners-subpages";
import { PtnIcon } from "./PtnIcon";

type PtnFaqProps = {
  content?: PtnFaqContent;
  /** Question ouverte au chargement (null : toutes fermées). */
  initialOpen?: number | null;
  variant?: "list" | "cards";
};

export function PtnFaq({ content = ptnFaq, initialOpen = 0, variant = "list" }: PtnFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpen);
  return (
    <section className={`ptn-faq${variant === "cards" ? " ptn-faq--cards" : ""}`} aria-labelledby="ptn-faq-title">
      {content.eyebrow ? <p className="ptn-eyebrow">{content.eyebrow}</p> : null}
      <h2 id="ptn-faq-title" className={`ptn-h2 ptn-h2--md${content.titleHidden ? " ptn-sr" : ""}`}>
        {content.title}
      </h2>
      <ul className="ptn-faq__list">
        {content.items.map((item, index) => {
          const open = openIndex === index;
          const buttonId = `ptn-faq-button-${index}`;
          const panelId = `ptn-faq-panel-${index}`;
          return (
            <li key={item.question} className="ptn-faq__item">
              <h3 className="ptn-faq__question">
                <button
                  type="button"
                  id={buttonId}
                  className="ptn-faq__button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{item.question}</span>
                  <PtnIcon name={open ? "chevronUp" : "chevronDown"} className="ptn-faq__icon" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`ptn-faq__answer${open ? "" : " is-closed"}`}
              >
                <p>{item.answer}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
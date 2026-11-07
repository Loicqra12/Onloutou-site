"use client";

import { useState } from "react";
import { expFaq } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";

export function ExpFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="exp-faq" aria-labelledby="exp-faq-title">
      <header className="exp-faq__head">
        <h2 id="exp-faq-title" className="exp-h2">
          {expFaq.title}
        </h2>
        <p className="exp-lead">{expFaq.lead}</p>
      </header>
      <ul className="exp-faq__list">
        {expFaq.items.map((item, index) => {
          const open = openIndex === index;
          const buttonId = `exp-faq-button-${index}`;
          const panelId = `exp-faq-panel-${index}`;
          return (
            <li key={item.question} className={`exp-faq__item${open ? " is-open" : ""}`}>
              <h3 className="exp-faq__question">
                <button
                  type="button"
                  id={buttonId}
                  className="exp-faq__button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{item.question}</span>
                  <ExpIcon name={open ? "minus" : "plus"} className="exp-faq__icon" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`exp-faq__answer${open ? "" : " is-closed"}`}
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
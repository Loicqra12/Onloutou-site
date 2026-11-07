"use client";

import { useId, useState } from "react";
import { glxFaq } from "@/content/geolocation-hub";
import { GlxIcon } from "./GlxIcon";

export function GlxFaq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="glx-section glx-faq" aria-labelledby="glx-faq-title">
      <div className="glx-wrap glx-faq__grid">
        <div className="glx-faq__intro">
          <p className="glx-kicker">{glxFaq.kicker}</p>
          <h2 id="glx-faq-title" className="glx-h2">
            <span className="glx-line">{glxFaq.titleLines[0]}</span>
            <span className="glx-line">
              <span className="glx-underline">{glxFaq.titleLines[1]}</span>
            </span>
          </h2>
          <p className="glx-lead">
            {glxFaq.lead.map((l) => (
              <span key={l} className="glx-line">
                {l}
              </span>
            ))}
          </p>
        </div>
        <div className="glx-faq__panel">
          <ul className="glx-faq__list">
            {glxFaq.items.map((item, i) => {
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
                      <GlxIcon name={isOpen ? "chevronUp" : "chevronDown"} strokeWidth={2} />
                    </button>
                  </h3>
                  <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="glx-faq__answer">
                    <p>{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="glx-note glx-note--info">
            <GlxIcon name="info" />
            {glxFaq.note}
          </p>
        </div>
      </div>
    </section>
  );
}

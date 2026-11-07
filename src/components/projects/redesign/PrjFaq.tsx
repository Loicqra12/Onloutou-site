"use client";

import Link from "next/link";
import { useState } from "react";
import { prjFaq } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";

export function PrjFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="prj-faq" aria-labelledby="prj-faq-title">
      <header className="prj-head">
        <p className="prj-eyebrow">{prjFaq.eyebrow}</p>
        <h2 id="prj-faq-title" className="prj-h2">
          {prjFaq.title}
        </h2>
      </header>
      <ul className="prj-faq__list">
        {prjFaq.items.map((item, index) => {
          const open = openIndex === index;
          const buttonId = `prj-faq-button-${index}`;
          const panelId = `prj-faq-panel-${index}`;
          return (
            <li key={item.question} className={`prj-faq__item${open ? " is-open" : ""}`}>
              <h3 className="prj-faq__question">
                <button
                  type="button"
                  id={buttonId}
                  className="prj-faq__button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{item.question}</span>
                  <PrjIcon name={open ? "minus" : "plus"} className="prj-faq__icon" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`prj-faq__answer${open ? "" : " is-closed"}`}
              >
                <p>{item.answer}</p>
                {"link" in item && item.link ? (
                  <p>
                    <Link href={item.link.href} className="prj-link prj-link--dark">
                      {item.link.label}
                      <PrjIcon name="arrowUpRight" className="prj-link__icon" />
                    </Link>
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
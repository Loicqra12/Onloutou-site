"use client";

import { useEffect, useId, useRef, useState } from "react";
import { becomePartnerReadiness } from "@/content/become-partner-page";

export function PartnerReadinessCheck() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<boolean[]>(() => becomePartnerReadiness.questions.map(() => false));
  useEffect(() => {
    rootRef.current?.classList.add("become-partner-readiness--enhanced");
  }, []);

  const count = checked.filter(Boolean).length;
  const total = becomePartnerReadiness.questions.length;

  let feedback = becomePartnerReadiness.feedback.few;
  if (count === total) feedback = becomePartnerReadiness.feedback.all;
  else if (count >= 4) feedback = becomePartnerReadiness.feedback.some;

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <section
      id="preparer-proposition"
      className="become-partner-readiness section-spacing scroll-mt-28 bg-brand-white"
      aria-labelledby="become-partner-readiness-title"
      ref={rootRef}
    >
      <div className="container-content become-partner-readiness__inner">
        <h2 id="become-partner-readiness-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {becomePartnerReadiness.title}
        </h2>

        <ul className="become-partner-readiness__list">
          {becomePartnerReadiness.questions.map((question, index) => (
            <li key={question}>
              <label className="become-partner-readiness__item" htmlFor={`${baseId}-q-${index}`}>
                <input
                  id={`${baseId}-q-${index}`}
                  type="checkbox"
                  checked={checked[index]}
                  onChange={() => toggle(index)}
                />
                <span>{question}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="become-partner-readiness__status" aria-live="polite">
          <p className="become-partner-readiness__count">
            {count} élément{count > 1 ? "s" : ""} préparé{count > 1 ? "s" : ""} sur {total}
          </p>
          <p className="become-partner-readiness__feedback">{feedback}</p>
        </div>
      </div>
    </section>
  );
}

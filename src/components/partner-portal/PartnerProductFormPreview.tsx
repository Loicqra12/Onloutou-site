"use client";

import { useState } from "react";
import { partnerProductFormPreview } from "@/content/partner-portal-page";

export function PartnerProductFormPreview() {
  const data = partnerProductFormPreview;
  const [notice, setNotice] = useState<string | null>(null);

  const onDemoAction = () => {
    setNotice(data.disconnectedNotice);
  };

  return (
    <div className="epp-form-preview">
      <header className="epp-form-preview__head">
        <h3 className="epp-form-preview__title">{data.title}</h3>
        <p className="epp-form-preview__notice">{data.notice}</p>
      </header>
      {notice ? (
        <p className="epp-form-preview__toast" role="status">{notice}</p>
      ) : null}
      <div className="epp-form-preview__layout">
        <div className="epp-form-preview__steps">
          {data.steps.map((step) => (
            <section key={step.title} className="epp-form-preview__step" aria-labelledby={`epp-step-${step.title}`}>
              <h4 id={`epp-step-${step.title}`} className="epp-form-preview__step-title">{step.title}</h4>
              {"fields" in step && step.fields ? (
                <ul className="epp-form-preview__fields">
                  {step.fields.map((field) => (
                    <li key={field}>
                      <label className="epp-form-preview__label">
                        <span>{field}</span>
                        <input type="text" disabled readOnly placeholder="—" className="epp-form-preview__input" />
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}
              {"modes" in step && step.modes ? (
                <ul className="epp-form-preview__modes">
                  {step.modes.map((mode) => (
                    <li key={mode}>{mode}</li>
                  ))}
                </ul>
              ) : null}
              {"slots" in step && step.slots ? (
                <div className="epp-form-preview__slots">
                  {step.slots.map((slot) => (
                    <div key={slot} className="epp-form-preview__slot" aria-disabled="true">
                      {slot}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
        <aside className="epp-form-preview__aside" aria-label={data.previewPanel.title}>
          <h4 className="epp-form-preview__aside-title">{data.previewPanel.title}</h4>
          <ul>
            {data.previewPanel.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="epp-form-preview__actions">
        {data.buttons.map((label) => (
          <button key={label} type="button" className="epp-form-preview__btn" onClick={onDemoAction}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { cookieChoiceStorageKey } from "@/content/cookies";

type Choice = {
  measure: boolean;
  marketing: boolean;
};

const necessaryOnly: Choice = { measure: false, marketing: false };
const acceptAll: Choice = { measure: true, marketing: true };

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(cookieChoiceStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Choice>;
    return { measure: Boolean(parsed.measure), marketing: Boolean(parsed.marketing) };
  } catch {
    return null;
  }
}

export function CookieNotice() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [choice, setChoice] = useState<Choice>(necessaryOnly);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = readChoice();
      if (saved) setChoice(saved);
      else setOpen(true);
    });

    function reopen() {
      setChoice(readChoice() ?? necessaryOnly);
      setDetails(true);
      setOpen(true);
    }

    window.addEventListener("onloutou-open-cookies", reopen);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("onloutou-open-cookies", reopen);
    };
  }, []);

  function save(next: Choice) {
    localStorage.setItem(cookieChoiceStorageKey, JSON.stringify(next));
    setChoice(next);
    setOpen(false);
    setDetails(false);
  }

  if (!open) return null;

  return (
    <div className="cookie-notice" data-testid="consent-banner" role="dialog" aria-labelledby={titleId}>
      <p id={titleId} className="cookie-notice__title">Vos cookies</p>
      <p className="cookie-notice__lead">
        Le site mémorise seulement ce qui sert à le faire fonctionner, par exemple une demande commencée dans le même onglet.
        Aucun cookie publicitaire ni de mesure d’audience n’est déposé.{" "}
        <Link href="/cookies">Politique de cookies</Link>
      </p>

      {details ? (
        <ul className="cookie-notice__list">
          <li>
            <div>
              <strong>Nécessaires</strong>
              <span>Toujours actifs. Ils ne servent pas à la publicité.</span>
            </div>
            <span className="cookie-notice__lock">Actifs</span>
          </li>
          <li>
            <div>
              <strong>Mesure d’audience</strong>
              <span>Aucun outil n’est branché aujourd’hui. Le choix est conservé pour plus tard.</span>
            </div>
            <button
              type="button"
              className={`cookie-notice__switch${choice.measure ? " is-on" : ""}`}
              role="switch"
              aria-checked={choice.measure}
              aria-label="Mesure d’audience"
              onClick={() => setChoice((current) => ({ ...current, measure: !current.measure }))}
            />
          </li>
          <li>
            <div>
              <strong>Marketing</strong>
              <span>Aucun cookie publicitaire n’est déposé.</span>
            </div>
            <button
              type="button"
              className={`cookie-notice__switch${choice.marketing ? " is-on" : ""}`}
              role="switch"
              aria-checked={choice.marketing}
              aria-label="Cookies marketing"
              onClick={() => setChoice((current) => ({ ...current, marketing: !current.marketing }))}
            />
          </li>
        </ul>
      ) : null}

      <div className="cookie-notice__actions">
        {details ? (
          <button type="button" className="cookie-notice__accept" onClick={() => save(choice)}>
            Enregistrer mes choix
          </button>
        ) : (
          <button type="button" className="cookie-notice__accept" onClick={() => save(acceptAll)}>
            Tout accepter
          </button>
        )}
        <button type="button" className="cookie-notice__necessary" onClick={() => save(necessaryOnly)}>
          Uniquement les nécessaires
        </button>
        {details ? null : (
          <button type="button" className="cookie-notice__manage" onClick={() => setDetails(true)}>
            Gérer les préférences
          </button>
        )}
      </div>
    </div>
  );
}

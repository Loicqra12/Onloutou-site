"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpAuth, dpPaths } from "@/content/devenir-partenaire";
import { DpIcon } from "@/components/partners/DpIcon";
import { DpPicture } from "@/components/partners/DpPicture";

export function PartnerRegisterForm() {
  const router = useRouter();
  const c = dpAuth.register;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get("terms")) {
      setError("Veuillez accepter les conditions d’utilisation.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await apiFetch("/auth/register/partner", {
      method: "POST",
      json: {
        email: String(form.get("email")),
        password: String(form.get("password")),
        displayName: String(form.get("displayName")),
        termsAccepted: true,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(dpPaths.home);
    router.refresh();
  }

  return (
    <div className="pa-reg">
      <div className="pa-intro">
        <h1>{c.introTitle}</h1>
        <p>{c.introLead}</p>
        <div className="pa-photos">
          {c.photos.map((image) => (
            <DpPicture key={image.file} image={image} sizes="(max-width: 700px) 50vw, 22vw" />
          ))}
        </div>
        <ul className="pa-bullets">
          {c.bullets.map((item, index) => (
            <li key={item}>
              <DpIcon name={index === 0 ? "layers" : index === 1 ? "pen" : "shield"} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="pa-card">
        <h1>{c.title}</h1>
        <p className="pa-lead">
          {c.already} <Link href={dpPaths.login} className="pa-link">{c.login}</Link>
        </p>
        <form className="pa-form" onSubmit={onSubmit} noValidate>
          <div className="pa-field">
            <label htmlFor="fld-displayName">{c.name}</label>
            <div className="pa-field__control">
              <DpIcon name="user" />
              <input id="fld-displayName" name="displayName" required autoComplete="name" placeholder={c.namePlaceholder} />
            </div>
          </div>
          <div className="pa-field">
            <label htmlFor="fld-email">{c.email}</label>
            <div className="pa-field__control">
              <DpIcon name="mail" />
              <input id="fld-email" name="email" type="email" required autoComplete="email" placeholder={c.emailPlaceholder} />
            </div>
          </div>
          <div className="pa-field">
            <label htmlFor="fld-password">{c.password}</label>
            <div className="pa-field__control">
              <DpIcon name="lock" />
              <input id="fld-password" name="password" type={show ? "text" : "password"} required minLength={10} autoComplete="new-password" placeholder={c.passwordPlaceholder} />
              <button type="button" className="pa-field__toggle" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                <DpIcon name="eye" />
              </button>
            </div>
            <p className="pa-hint">{c.passwordHint}</p>
          </div>
          <label className="pa-check">
            <input type="checkbox" name="terms" value="1" required />
            <span>
              J’accepte les <Link href={c.termsCguHref} className="pa-link">conditions d’utilisation</Link> et j’ai lu la{" "}
              <Link href={c.termsPrivacyHref} className="pa-link">politique de confidentialité</Link>.
            </span>
          </label>
          {error ? <p className="pa-error" role="alert">{error}</p> : null}
          <button type="submit" className="pa-submit" disabled={pending}>
            {pending ? "Création…" : `${c.submit} →`}
          </button>
          <p className="pa-hint">{c.after}</p>
        </form>
      </div>
      <p className="pa-help pa-help--center">
        <DpIcon name="headset" /> {c.help} <Link href={c.helpHref} className="pa-link">{c.helpLink}</Link>
      </p>
    </div>
  );
}

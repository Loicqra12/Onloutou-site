"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpPaths, dpSpace } from "@/content/devenir-partenaire";
import { abidjanCommunes, ppCopy as t, type ProfileEtape } from "@/content/partner-profile-wizard";
import { DpIcon } from "@/components/partners/DpIcon";
import { usePartnerSession } from "@/components/partners/usePartnerSession";
import {
  maskPhone,
  nationalPhone,
  profileInitials,
  storedPhone,
  type PartnerPersonKind,
  type PartnerProfile,
} from "@/lib/partner-profile";
import "@/styles/partner-profile.css";

type ProfilePayload = {
  personKind: PartnerPersonKind;
  phone: string;
  commune: string;
  commercialName: string | null;
  legalName: string | null;
  description: string;
  displayName: string;
};

const ETAPES: ProfileEtape[] = ["informations", "activite", "verifier", "suivi"];

function isEtape(value: string | null): value is ProfileEtape {
  return value !== null && (ETAPES as string[]).includes(value);
}

export function PartnerProfileWizard() {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh } = usePartnerSession();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"save" | "continue" | "submit" | "mail" | null>(null);
  const [mailNotice, setMailNotice] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [personKind, setPersonKind] = useState<PartnerPersonKind>("PROFESSIONAL");
  const [phone, setPhone] = useState("");
  const [commune, setCommune] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await apiFetch<{ profile: PartnerProfile }>("/partner/me");
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const next = res.data.profile;
      setProfile(next);
      setDisplayName(next.user.displayName ?? "");
      if (next.personKind) setPersonKind(next.personKind);
      setPhone(nationalPhone(next.user.phone));
      setCommune(next.commune ?? "");
      setCommercialName(next.commercialName ?? "");
      setLegalName(next.legalName ?? "");
      setDescription(next.description ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reviewing = profile?.status === "SUBMITTED";
  const approved = profile?.status === "APPROVED";
  const refused = profile?.status === "REJECTED";
  const requested = isEtape(search.get("etape")) ? (search.get("etape") as ProfileEtape) : null;
  const lecture = search.get("lecture") === "1";

  const etape: ProfileEtape = useMemo(() => {
    if (!profile) return "informations";
    if (reviewing || approved) {
      if (requested === "verifier" && lecture) return "verifier";
      return "suivi";
    }
    if (requested && requested !== "suivi") return requested;
    return "informations";
  }, [profile, reviewing, approved, requested, lecture]);

  useEffect(() => {
    if (!profile) return;
    if ((reviewing || approved) && requested && requested !== "suivi" && !(requested === "verifier" && lecture)) {
      router.replace(`${dpPaths.account}?etape=suivi`);
    }
  }, [profile, reviewing, approved, requested, lecture, router]);

  function payload(): ProfilePayload {
    return {
      personKind,
      phone: storedPhone(phone),
      commune: commune.trim(),
      commercialName: commercialName.trim() || null,
      legalName: personKind === "PROFESSIONAL" ? legalName.trim() || null : null,
      description: description.trim(),
      displayName: displayName.trim(),
    };
  }

  function go(next: ProfileEtape, extra?: Record<string, string>) {
    const params = new URLSearchParams({ etape: next, ...extra });
    router.push(`${dpPaths.account}?${params.toString()}`);
  }

  async function save(data: ProfilePayload) {
    const res = await apiFetch<{ profile: PartnerProfile }>("/partner/profile", {
      method: "PATCH",
      json: data,
    });
    if (!res.ok) return res;
    setProfile(res.data.profile);
    return res;
  }

  const autosaveReady = useRef(false);
  useEffect(() => {
    if (!profile || (profile.status !== "DRAFT" && profile.status !== "REJECTED")) return;
    if (!autosaveReady.current) {
      autosaveReady.current = true;
      return;
    }
    const data = payload();
    const handle = window.setTimeout(() => {
      void save(data);
    }, 400);
    return () => window.clearTimeout(handle);
    // payload() already closes over the listed fields.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName, personKind, phone, commune, commercialName, legalName, description, profile]);


  function validateInformations(): string | null {
    if (!displayName.trim()) return t.a.needName;
    if (nationalPhone(phone).length < 8) return t.a.needPhone;
    if (!commune.trim()) return t.a.needCommune;
    return null;
  }

  function validateActivite(): string | null {
    if (!description.trim()) return t.b.needDescription;
    if (description.trim().length > t.b.descriptionMax) {
      return `La présentation est limitée à ${t.b.descriptionMax} caractères.`;
    }
    return null;
  }

  async function onSaveQuit() {
    setPending("save");
    setError(null);
    const res = await save(payload());
    setPending(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(dpPaths.home);
  }

  async function onContinue() {
    setError(null);
    const issue = etape === "informations" ? validateInformations() : etape === "activite" ? validateActivite() : null;
    if (issue) {
      setError(issue);
      return;
    }
    setPending("continue");
    const res = await save(payload());
    setPending(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (etape === "informations") go("activite");
    else if (etape === "activite") go("verifier");
  }

  async function onSubmit() {
    setError(null);
    const issue = validateInformations() ?? validateActivite();
    if (issue) {
      setError(issue);
      return;
    }
    setPending("submit");
    const data = payload();
    const saved = await save(data);
    if (!saved.ok) {
      setPending(null);
      setError(saved.error);
      return;
    }
    const res = await apiFetch<{ profile: PartnerProfile }>("/partner/profile/submit", {
      method: "POST",
      json: data,
    });
    setPending(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProfile(res.data.profile);
    go("suivi");
  }

  async function onResend() {
    setPending("mail");
    setMailNotice(null);
    const res = await apiFetch<{ sent?: boolean; message?: string; alreadyVerified?: boolean; mailConfigured?: boolean }>(
      "/auth/email/request",
      { method: "POST" },
    );
    setPending(null);
    if (!res.ok) {
      setMailNotice(res.error);
      return;
    }
    setMailNotice(res.data.message ?? (res.data.alreadyVerified ? t.a.verified : ""));
    await refresh();
    const me = await apiFetch<{ profile: PartnerProfile }>("/partner/me");
    if (me.ok) setProfile(me.data.profile);
  }

  if (!profile && !error) return <p>{t.loading}</p>;
  if (!profile) return <p className="pp-error" role="alert">{error}</p>;

  const previewTitle = commercialName.trim() || displayName.trim() || "Votre profil";
  const initials = profileInitials(previewTitle);
  const verified = Boolean(profile.user.emailVerifiedAt);
  const readOnly = (reviewing || approved) && lecture;
  const stepIndex = etape === "informations" ? 1 : etape === "activite" ? 2 : 3;

  return (
    <div className="pp">
      <p className="pp-crumb">
        <Link href={dpPaths.account}>{t.crumbAccount}</Link>
        {" / "}
        <strong>{t.crumbProfile}</strong>
      </p>

      {etape !== "suivi" ? (
        <>
          <div className="pp-head">
            <div>
              <h1>{etape === "informations" ? t.a.title : etape === "activite" ? t.b.title : t.c.title}</h1>
              <p>{etape === "informations" ? t.a.lead : etape === "activite" ? t.b.lead : t.c.lead}</p>
            </div>
            {etape === "informations" ? (
              <span className={refused ? "pp-review-badge" : "pp-draft"}>
                <DpIcon name={refused ? "info" : "doc"} /> {refused ? t.refused.badge : t.draftBadge}
              </span>
            ) : null}
          </div>
          <Stepper current={stepIndex} />
          {refused ? (
            <p className="pp-status-line" role="status" style={{ margin: "0.65rem 0 0" }}>
              <DpIcon name="info" />
              {t.refused.banner}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="pp-head">
            <div>
              <h1>{t.d.title}</h1>
              <p>{t.d.lead}</p>
            </div>
          </div>
          <span className="pp-review-badge">{refused ? t.refused.badge : t.d.reviewingBadge}</span>
        </>
      )}

      {etape === "informations" ? (
        <StepInformations
          displayName={displayName}
          setDisplayName={setDisplayName}
          personKind={personKind}
          setPersonKind={setPersonKind}
          phone={phone}
          setPhone={setPhone}
          commune={commune}
          setCommune={setCommune}
          email={profile.user.email}
          verified={verified}
          mailNotice={mailNotice}
          onResend={() => void onResend()}
          resending={pending === "mail"}
        />
      ) : null}

      {etape === "activite" ? (
        <StepActivite
          personKind={personKind}
          commercialName={commercialName}
          setCommercialName={setCommercialName}
          legalName={legalName}
          setLegalName={setLegalName}
          description={description}
          setDescription={setDescription}
          commune={commune}
          previewTitle={previewTitle}
          initials={initials}
        />
      ) : null}

      {etape === "verifier" ? (
        <StepVerifier
          profile={profile}
          displayName={displayName}
          personKind={personKind}
          phone={storedPhone(phone) || profile.user.phone}
          commune={commune}
          commercialName={commercialName}
          legalName={legalName}
          description={description}
          verified={verified}
          readOnly={readOnly}
        />
      ) : null}

      {etape === "suivi" ? (
        <StepSuivi
          previewTitle={previewTitle}
          initials={initials}
          personKind={personKind}
          commune={commune}
          complement={profile.rejectionReason}
        />
      ) : null}

      {error ? <p className="pp-error" role="alert">{error}</p> : null}

      {etape !== "suivi" && !readOnly ? (
        <div className="pp-bar-wrap">
          <div className="pp-bar">
            {etape === "informations" ? (
              <button type="button" className="pp-linkbtn" disabled={pending !== null} onClick={() => void onSaveQuit()}>
                {t.saveQuit}
              </button>
            ) : (
              <button type="button" className="pp-btn" disabled={pending !== null} onClick={() => go(etape === "verifier" ? "activite" : "informations")}>
                ← {t.back}
              </button>
            )}
            <div className="pp-bar__right">
              {etape !== "informations" ? (
                <button type="button" className="pp-btn" disabled={pending !== null} onClick={() => void onSaveQuit()}>
                  {t.saveQuit}
                </button>
              ) : null}
              {etape === "verifier" ? (
                <button type="button" className="pp-btn pp-btn--yellow" disabled={pending !== null} onClick={() => void onSubmit()}>
                  {pending === "submit" ? "Transmission…" : t.c.submit} →
                </button>
              ) : (
                <button type="button" className="pp-btn pp-btn--yellow" disabled={pending !== null} onClick={() => void onContinue()}>
                  {etape === "informations" ? t.a.continue : t.b.continue} →
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {readOnly ? (
        <div className="pp-bar-wrap">
          <div className="pp-bar">
            <Link href={`${dpPaths.account}?etape=suivi`} className="pp-btn">← {t.back}</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const items = [
    { n: 1, label: t.steps.informations, etape: "informations" as const },
    { n: 2, label: t.steps.activite, etape: "activite" as const },
    { n: 3, label: t.steps.verifier, etape: "verifier" as const },
  ];
  return (
    <div className="pp-stepper" aria-label="Étapes du profil">
      {items.map((item, index) => {
        const state = item.n < current ? "is-done" : item.n === current ? "is-current" : "";
        return (
          <span key={item.n} style={{ display: "contents" }}>
            {index > 0 ? <span className="pp-step__line" aria-hidden /> : null}
            <span className={`pp-step ${state}`.trim()} aria-current={item.n === current ? "step" : undefined}>
              <span className="pp-step__n">
                {item.n < current ? <DpIcon name="check" /> : item.n}
              </span>
              <span className="pp-step__label">{item.label}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

function StepInformations(props: {
  displayName: string;
  setDisplayName: (v: string) => void;
  personKind: PartnerPersonKind;
  setPersonKind: (v: PartnerPersonKind) => void;
  phone: string;
  setPhone: (v: string) => void;
  commune: string;
  setCommune: (v: string) => void;
  email: string;
  verified: boolean;
  mailNotice: string | null;
  onResend: () => void;
  resending: boolean;
}) {
  return (
    <div className="pp-grid">
      <section className="pp-card">
        <h2>{t.a.kindTitle}</h2>
        <div className="pp-kind" role="radiogroup" aria-label={t.a.kindTitle}>
          <button
            type="button"
            role="radio"
            aria-checked={props.personKind === "INDIVIDUAL"}
            className={`pp-kind__card${props.personKind === "INDIVIDUAL" ? " is-selected" : ""}`}
            onClick={() => props.setPersonKind("INDIVIDUAL")}
          >
            <DpIcon name="user" />
            <span>
              <strong>{t.a.individual}</strong>
              <span>{t.a.individualText}</span>
            </span>
            <span className="pp-radio" aria-hidden />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={props.personKind === "PROFESSIONAL"}
            className={`pp-kind__card${props.personKind === "PROFESSIONAL" ? " is-selected" : ""}`}
            onClick={() => props.setPersonKind("PROFESSIONAL")}
          >
            <DpIcon name="briefcase" />
            <span>
              <strong>{t.a.professional}</strong>
              <span>{t.a.professionalText}</span>
            </span>
            <span className="pp-radio" aria-hidden />
          </button>
        </div>

        <div className="pp-fields">
          <div className="pp-field">
            <label htmlFor="pp-name">{t.a.name}</label>
            <div className="pp-control">
              <DpIcon name="user" />
              <input id="pp-name" value={props.displayName} onChange={(e) => props.setDisplayName(e.target.value)} autoComplete="name" />
            </div>
          </div>
          <div className="pp-field">
            <label htmlFor="pp-email">{t.a.email}</label>
            <div className="pp-control">
              <DpIcon name="mail" />
              <input id="pp-email" value={props.email} readOnly autoComplete="email" />
            </div>
            {props.verified ? (
              <p className="pp-verified">
                <DpIcon name="check" /> {t.a.verified}
              </p>
            ) : (
              <p className="pp-unverified">
                {t.a.unverified} ·{" "}
                <button type="button" onClick={props.onResend} disabled={props.resending}>
                  {t.a.resend}
                </button>
              </p>
            )}
            {props.mailNotice ? <p className="pp-flag-note" role="status">{props.mailNotice}</p> : null}
          </div>
          <div className="pp-field">
            <label htmlFor="pp-phone">{t.a.phone}</label>
            <div className="pp-control">
              <DpIcon name="phone" />
              <span className="pp-prefix">
                {t.a.phonePrefix} <DpIcon name="chevron" />
              </span>
              <span className="pp-sep" aria-hidden />
              <input
                id="pp-phone"
                type="tel"
                inputMode="tel"
                placeholder={t.a.phonePlaceholder}
                value={props.phone}
                onChange={(e) => props.setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                autoComplete="tel-national"
              />
            </div>
          </div>
          <div className="pp-field">
            <label htmlFor="pp-commune">{t.a.commune}</label>
            <div className="pp-control">
              <DpIcon name="pin" />
              <select id="pp-commune" value={props.commune} onChange={(e) => props.setCommune(e.target.value)}>
                <option value="">{t.a.communePlaceholder}</option>
                {abidjanCommunes.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className="pp-hint-inline">
          <DpIcon name="info" /> {t.a.placeNote}
        </p>
      </section>
      <aside className="pp-aside">
        <h2>{t.a.whyTitle}</h2>
        <ul className="pp-why">
          {t.a.why.map((item) => (
            <li key={item.title}>
              <DpIcon name={item.icon} />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <p className="pp-privacy">
          <DpIcon name="lock" />
          {t.a.privacy}
        </p>
      </aside>
    </div>
  );
}

function StepActivite(props: {
  personKind: PartnerPersonKind;
  commercialName: string;
  setCommercialName: (v: string) => void;
  legalName: string;
  setLegalName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  commune: string;
  previewTitle: string;
  initials: string;
}) {
  const isPro = props.personKind === "PROFESSIONAL";
  const count = props.description.length;
  return (
    <div className="pp-grid">
      <section className="pp-card">
        <div className="pp-card__head">
          <DpIcon name="shop" />
          <h2>{isPro ? t.b.activityTitlePro : t.b.activityTitleIndividual}</h2>
          <span className="pp-badge">{isPro ? t.b.badgePro : t.b.badgeIndividual}</span>
        </div>
        <div className="pp-fields">
          <div className="pp-field">
            <label htmlFor="pp-commercial">
              {t.b.commercial} <span className="pp-opt">({t.b.optional})</span>
            </label>
            <div className="pp-control">
              <input
                id="pp-commercial"
                value={props.commercialName}
                onChange={(e) => props.setCommercialName(e.target.value)}
                placeholder={isPro ? undefined : t.b.commercialPlaceholder}
              />
            </div>
            <p className="pp-field-hint">{t.b.commercialHint}</p>
          </div>
          {isPro ? (
            <div className="pp-field">
              <label htmlFor="pp-legal">
                {t.b.legal} <span className="pp-opt">({t.b.optional})</span>
              </label>
              <div className="pp-control">
                <input
                  id="pp-legal"
                  value={props.legalName}
                  onChange={(e) => props.setLegalName(e.target.value)}
                  placeholder={t.b.legalPlaceholder}
                />
              </div>
            </div>
          ) : null}
          <div className="pp-field pp-field--full">
            <label htmlFor="pp-description">{t.b.description}</label>
            <div className="pp-control">
              <textarea
                id="pp-description"
                maxLength={t.b.descriptionMax}
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value.slice(0, t.b.descriptionMax))}
              />
            </div>
            <p className="pp-count">{count} / {t.b.descriptionMax}</p>
          </div>
        </div>
        <div className="pp-commune-row">
          <strong>
            <DpIcon name="pin" /> {t.b.communeLabel}{"\u00a0"}: {props.commune || "—"}
          </strong>
          <Link href={`${dpPaths.account}?etape=informations`} className="pp-btn">{t.b.modify}</Link>
        </div>
        <div className="pp-image-row">
          <div className="pp-image-thumb" aria-hidden>
            <DpIcon name="camera" />
          </div>
          <div>
            <h3>{t.b.imageTitle}</h3>
            <p className="pp-muted">{t.b.imageOptional}</p>
            <button type="button" className="pp-btn" disabled aria-disabled="true">
              {t.b.imageAdd}
            </button>
            <p className="pp-flag-note">{t.b.imageUnavailable}</p>
          </div>
        </div>
        <p className="pp-docs">
          <DpIcon name="folder" />
          <span className="pp-docs__rule" aria-hidden />
          {t.b.documentsNote}
        </p>
      </section>
      <aside>
        <div className="pp-aside">
          <span className="pp-preview-kicker">{t.b.previewKicker}</span>
          <div className="pp-preview-id">
            <span className="pp-avatar" aria-hidden>{props.initials}</span>
            <h3>{props.previewTitle}</h3>
            <span className="pp-badge">{isPro ? t.b.badgePro : t.b.badgeIndividual}</span>
            <span className="pp-loc">
              <DpIcon name="pin" /> {props.commune || "—"}
            </span>
          </div>
          {props.description.trim() ? <p className="pp-preview-text">{props.description}</p> : null}
        </div>
        <p className="pp-aside-hint">
          <DpIcon name="info" />
          <span className="pp-aside-hint__rule" aria-hidden />
          <span>
            <strong>{t.b.previewHintTitle}</strong> {t.b.previewHintText}
          </span>
        </p>
      </aside>
    </div>
  );
}

function StepVerifier(props: {
  profile: PartnerProfile;
  displayName: string;
  personKind: PartnerPersonKind;
  phone: string | null;
  commune: string;
  commercialName: string;
  legalName: string;
  description: string;
  verified: boolean;
  readOnly: boolean;
}) {
  const isPro = props.personKind === "PROFESSIONAL";
  const modifier = (etape: ProfileEtape) =>
    props.readOnly ? null : (
      <Link href={`${dpPaths.account}?etape=${etape}`} className="pp-modify">{t.c.modify}</Link>
    );
  return (
    <div className="pp-grid">
      <div className="pp-recap">
        <section className="pp-card">
          <div className="pp-card__head">
            <DpIcon name="user" />
            <h2>{t.c.infos}</h2>
            {modifier("informations")}
          </div>
          <dl>
            <div className="pp-recap-row">
              <dt>{t.c.labelProfil}</dt>
              <dd><span className="pp-badge">{isPro ? t.b.badgePro : t.b.badgeIndividual}</span></dd>
            </div>
            <div className="pp-recap-row">
              <dt>{t.c.labelNom}</dt>
              <dd>{props.displayName}</dd>
            </div>
            <div className="pp-recap-row">
              <dt>{t.c.labelEmail}</dt>
              <dd>
                {props.profile.user.email}
                {props.verified ? (
                  <span className="pp-verified-pill"><DpIcon name="check" /> {t.a.verified}</span>
                ) : (
                  <span className="pp-unverified"> · {t.a.unverified}</span>
                )}
              </dd>
            </div>
            <div className="pp-recap-row">
              <dt>{t.c.labelPhone}</dt>
              <dd>{maskPhone(props.phone)}</dd>
            </div>
            <div className="pp-recap-row">
              <dt>{t.c.labelCommune}</dt>
              <dd>{props.commune}</dd>
            </div>
          </dl>
        </section>
        <section className="pp-card">
          <div className="pp-card__head">
            <DpIcon name="shop" />
            <h2>{t.c.activity}</h2>
            {modifier("activite")}
          </div>
          <dl>
            {props.commercialName.trim() ? (
              <div className="pp-recap-row">
                <dt>{t.c.labelCommercial}</dt>
                <dd>{props.commercialName}</dd>
              </div>
            ) : null}
            {isPro && props.legalName.trim() ? (
              <div className="pp-recap-row">
                <dt>{t.c.labelLegal}</dt>
                <dd>{props.legalName}</dd>
              </div>
            ) : null}
            <div className="pp-recap-row">
              <dt>{t.c.labelDescription}</dt>
              <dd>{props.description}</dd>
            </div>
            <div className="pp-recap-row">
              <dt>{t.c.labelImage}</dt>
              <dd>{t.c.imageMissing}</dd>
            </div>
          </dl>
        </section>
        <section className="pp-card pp-docs-card">
          <DpIcon name="folder" />
          <h2>{t.c.documents}</h2>
          <span className="pp-docs-card__rule" aria-hidden />
          <p style={{ margin: 0 }}>{t.c.documentsValue}</p>
        </section>
      </div>
      <aside>
        <section className="pp-aside">
          <div className="pp-card__head">
            <DpIcon name="list" />
            <h2>{t.c.afterTitle}</h2>
          </div>
          <ol className="pp-after">
            {t.c.after.map((line, i) => (
              <li key={line}>
                <span className="pp-after__n">{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>
        <p className="pp-callout pp-callout--yellow" style={{ marginTop: "0.85rem" }}>
          <DpIcon name="info" />
          <span className="pp-callout__rule" aria-hidden />
          <strong>{t.c.draftHint}</strong>
        </p>
        <p className="pp-callout pp-callout--plain" style={{ marginTop: "0.85rem" }}>
          <DpIcon name="info" />
          <span className="pp-callout__rule" aria-hidden />
          <span>{t.c.publishHint}</span>
        </p>
      </aside>
    </div>
  );
}

function StepSuivi(props: {
  previewTitle: string;
  initials: string;
  personKind: PartnerPersonKind;
  commune: string;
  complement: string | null | undefined;
}) {
  const isPro = props.personKind === "PROFESSIONAL";
  return (
    <>
      <div className="pp-grid">
        <div>
        <section className="pp-card">
          <div className="pp-track-head">
            <DpIcon name="shieldClock" />
            <h2>{t.d.trackTitle}</h2>
          </div>
          <div className="pp-tracker" aria-label={t.d.trackTitle}>
            <div className="pp-tracker__row">
              <span className="pp-tracker__dot is-done"><DpIcon name="check" /></span>
              <span className="pp-tracker__line is-done" aria-hidden />
              <span className="pp-tracker__dot is-current">2</span>
              <span className="pp-tracker__line" aria-hidden />
              <span className="pp-tracker__dot">3</span>
            </div>
            <div className="pp-tracker__labels">
              <span className="pp-tracker__label is-done">{t.d.step1}</span>
              <span className="pp-tracker__label is-current">{t.d.step2}</span>
              <span className="pp-tracker__label">{t.d.step3}</span>
            </div>
          </div>
          <div className="pp-status-lines">
            <p className="pp-status-line">
              <DpIcon name="info" />
              <span className="pp-status-line__rule" aria-hidden />
              {t.d.noAction}
            </p>
            <p className="pp-status-line">
              <DpIcon name="list" />
              <span className="pp-status-line__rule" aria-hidden />
              {props.complement?.trim() ? props.complement : t.d.complementIdle}
            </p>
          </div>
          <p className="pp-sent-link">
            <Link href={`${dpPaths.account}?etape=verifier&lecture=1`}>
              {t.d.viewSent} →
            </Link>
          </p>
        </section>
        <section className="pp-article">
          <DpIcon name="shop" />
          <span className="pp-article__rule" aria-hidden />
          <div>
            <h2>{t.d.articleTitle}</h2>
            <p>{t.d.articleText}</p>
          </div>
          <Link href={dpPaths.articles} className="pp-btn pp-btn--yellow">+ {t.d.articleCta}</Link>
        </section>
        </div>
        <aside>
          <div className="pp-aside pp-preview-card">
            <div className="pp-preview-id">
              <span className="pp-avatar" aria-hidden>{props.initials}</span>
              <h3>{props.previewTitle}</h3>
              <span className="pp-badge">{isPro ? t.b.badgePro : t.b.badgeIndividual}</span>
              <span className="pp-loc"><DpIcon name="pin" /> {props.commune || "—"}</span>
            </div>
            <span className="pp-status-pill"><DpIcon name="clock" /> {t.d.statusTransmitted}</span>
          </div>
          <div className="pp-aside pp-help-card" style={{ marginTop: "0.85rem" }}>
            <div className="pp-help-head">
              <DpIcon name="headset" />
              <span className="pp-help-head__rule" aria-hidden />
              <div>
                <h2>{t.d.helpTitle}</h2>
                <p>{t.d.helpText}</p>
              </div>
            </div>
            <Link href={dpSpace.contactHref} className="pp-btn">{t.d.contact}</Link>
          </div>
        </aside>
      </div>
      <section className="pp-card pp-two">
        <span className="pp-two__icons">
          <DpIcon name="shield" />
          <DpIcon name="box" />
        </span>
        <span className="pp-two__rule" aria-hidden />
        <h2>{t.d.twoTitle}</h2>
        <span className="pp-two__split" aria-hidden />
        <div className="pp-two__items">
          <div className="pp-two__item">
            {t.d.two1} <span className="pp-badge">{t.d.two1Badge}</span>
          </div>
          <div className="pp-two__item">
            {t.d.two2} <span className="pp-pill-soft">{t.d.two2Badge}</span>
          </div>
        </div>
        <p className="pp-two-note">
          <DpIcon name="info" /> {t.d.draftNote}
        </p>
      </section>
    </>
  );
}

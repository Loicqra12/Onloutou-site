"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useEffect, useMemo, useState, type FormEvent, useSyncExternalStore } from "react";
import {
  ELM_CONFIRMATION_PATH,
  ELM_DEMO_REFERENCE,
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmAislePath,
  elmDemandeCopy,
  elmPlaces,
  elmSceneTerracePair,
  elmWhyImages,
} from "@/content/electromenager";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import { elmRequestMessage } from "@/lib/electromenager-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useElmRequest } from "./ElmRequest";

function AccentTitle({ title, accent, className }: { title: string; accent: string; className?: string }) {
  const accentAt = title.indexOf(accent);
  if (accentAt < 0) return <h1 className={className}>{title}</h1>;
  return (
    <h1 className={className}>
      {title.slice(0, accentAt)}
      <span className="elm-underline">{accent}</span>
      {title.slice(accentAt + accent.length)}
    </h1>
  );
}

export function ElmDemande() {
  const router = useRouter();
  const request = useElmRequest();
  const submitCatalog = useCatalogFamilySubmit(ELM_DEMO_REFERENCE);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const why = useMemo(
    () =>
      elmDemandeCopy.why.map((item) => ({
        ...item,
        image: elmWhyImages[item.image],
      })),
    [],
  );

  
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;
    if (request.itemsWithProduct.length === 0) {
      router.replace(ELM_ROOT);
    }
  }, [mounted, request.itemsWithProduct.length, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!request.state.name.trim() || !request.state.phone.trim()) {
      setError("Indiquez votre nom et votre téléphone pour envoyer la demande.");
      return;
    }
    if (request.itemsWithProduct.length === 0) {
      setError("Ajoutez au moins un appareil à votre demande.");
      return;
    }
    setPending(true);
    setError(null);

    try {
      const result = await submitCatalog({
        source: "electromenager-demande",
        type: "RENTAL",
        contactName: request.state.name.trim(),
        contactPhone: request.state.phone.trim(),
        contactEmail: request.state.email.trim() || undefined,
        zone: request.state.zone.trim() || undefined,
        message: elmRequestMessage(request.state),
        sourcePath: ELM_CONFIRMATION_PATH,
        payload: {
          familyLabel: ELM_FAMILY_LABEL,
          items: request.itemsWithProduct.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
          })),
          startDate: request.state.startDate,
          endDate: request.state.endDate,
          dates: request.state.dates,
          usage: request.state.usage,
          delivery: request.state.delivery,
          installation: request.state.installation,
          formation: request.state.formation,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      request.setMeta({
        reference: result.reference,
        dates:
          request.state.startDate && request.state.endDate
            ? `${request.state.startDate} – ${request.state.endDate}`
            : request.state.dates,
      });
      router.push(ELM_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  };

  if (request.itemsWithProduct.length === 0) {
    return <div className="elm-page elm-page--demande" />;
  }

  const whyTitle = elmDemandeCopy.whyTitle;
  const whyAccent = elmDemandeCopy.whyTitleAccent;
  const whyAccentAt = whyTitle.indexOf(whyAccent);

  return (
    <div className="elm-page elm-page--demande">
      <header className="elm-demande-hero">
        <AccentTitle title={elmDemandeCopy.title} accent={elmDemandeCopy.titleAccent} className="elm-h1 elm-h1--demande" />
        <p className="elm-lead">{elmDemandeCopy.lead}</p>
      </header>

      <div className="elm-demande-grid">
        <form className="elm-demande-form" onSubmit={onSubmit} noValidate>
          <section className="elm-card" aria-labelledby="elm-items-title">
            <h2 id="elm-items-title">{elmDemandeCopy.itemsTitle}</h2>
            <ul className="elm-demande-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={72} height={72} className="elm-demande-items__thumb" />
                  <div>
                    <strong>{item.title}</strong>
                    <div className="elm-qty" role="group" aria-label={`Quantité pour ${item.title}`}>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity - 1)} aria-label="Diminuer">
                        <VhpIcon name="minus" strokeWidth={1.5} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity + 1)} aria-label="Augmenter">
                        <VhpIcon name="plus" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  <button type="button" className="elm-icon-btn" onClick={() => request.remove(item.id)} aria-label={`Retirer ${item.title}`}>
                    <VhpIcon name="trash" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href={ELM_ROOT} className="elm-btn elm-btn--ghost elm-btn--small">
              <VhpIcon name="plus" strokeWidth={1.5} />
              {elmDemandeCopy.addDevice}
            </Link>
          </section>

          <section className="elm-card elm-card--grid2">
            <label>
              <span>{elmDemandeCopy.placeLabel}</span>
              <span className="elm-field--icon elm-field--select">
                <VhpIcon name="pin" strokeWidth={1.5} className="elm-search__icon" />
                <select value={request.state.zone} onChange={(event) => request.setMeta({ zone: event.target.value })} required>
                  <option value="">Choisir</option>
                  {elmPlaces.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              <VhpIcon name="chevronDown" className="elm-field__caret" strokeWidth={1.8} /></span>
            </label>
            <label>
              <span>{elmDemandeCopy.startLabel}</span>
              <span className="elm-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="elm-search__icon" />
                <input
                  type="date"
                  value={request.state.startDate}
                  onChange={(event) => request.setMeta({ startDate: event.target.value })}
                />
              </span>
            </label>
            <label>
              <span>{elmDemandeCopy.endLabel}</span>
              <span className="elm-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="elm-search__icon" />
                <input type="date" value={request.state.endDate} onChange={(event) => request.setMeta({ endDate: event.target.value })} />
              </span>
            </label>
          </section>

          <section className="elm-card">
            <label>
              <span>{elmDemandeCopy.usageLabel}</span>
              <textarea
                rows={4}
                value={request.state.usage}
                onChange={(event) => request.setMeta({ usage: event.target.value })}
                placeholder={elmDemandeCopy.usagePlaceholder}
              />
            </label>
            <div className="elm-attach" role="group" aria-label={elmDemandeCopy.attachLabel}>
              <VhpIcon name="file" strokeWidth={1.5} />
              <div>
                <strong>{elmDemandeCopy.attachLabel}</strong>
                <p>{elmDemandeCopy.attachHint}</p>
              </div>
            </div>
          </section>

          <section className="elm-card" aria-labelledby="elm-services-title">
            <h2 id="elm-services-title">{elmDemandeCopy.servicesTitle}</h2>
            <ul className="elm-checks">
              {elmDemandeCopy.services.map((service) => {
                const checked =
                  service.id === "delivery"
                    ? request.state.delivery
                    : service.id === "installation"
                      ? request.state.installation
                      : request.state.formation;
                return (
                  <li key={service.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          if (service.id === "delivery") request.setMeta({ delivery: event.target.checked });
                          else if (service.id === "installation") request.setMeta({ installation: event.target.checked });
                          else request.setMeta({ formation: event.target.checked });
                        }}
                      />
                      <span>{service.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="elm-card elm-card--grid2" aria-labelledby="elm-contact-title">
            <h2 id="elm-contact-title">{elmDemandeCopy.contactTitle}</h2>
            <label>
              <span>{elmDemandeCopy.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                value={request.state.name}
                onChange={(event) => request.setMeta({ name: event.target.value })}
                required
              />
            </label>
            <label>
              <span>{elmDemandeCopy.phoneLabel}</span>
              <input
                type="tel"
                autoComplete="tel"
                value={request.state.phone}
                onChange={(event) => request.setMeta({ phone: event.target.value })}
                required
              />
            </label>
            <label className="elm-span-2">
              <span>{elmDemandeCopy.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                value={request.state.email}
                onChange={(event) => request.setMeta({ email: event.target.value })}
              />
            </label>
          </section>

          {error ? (
            <p className="elm-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="elm-demande-actions">
            <button type="submit" className="elm-btn elm-btn--yellow elm-btn--block" disabled={pending}>
              {pending ? "Envoi…" : elmDemandeCopy.submit}
              <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
            </button>
            <Link href={elmAislePath(request.itemsWithProduct[0].aisleId)} className="elm-btn elm-btn--ghost elm-btn--block">
              <VhpIcon name="notePen" strokeWidth={1.5} />
              {elmDemandeCopy.edit}
            </Link>
          </div>
        </form>

        <aside className="elm-recap" aria-labelledby="elm-recap-title">
          <h2 id="elm-recap-title">{elmDemandeCopy.recapTitle}</h2>
          <ul>
            {request.itemsWithProduct.map((item) => (
              <li key={item.id}>
                <Image src={item.image.src} alt="" width={56} height={56} />
                <span>
                  {item.title}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <VhpIcon name="calendar" strokeWidth={1.5} />
            <span>
              <strong>{elmDemandeCopy.periodLabel}</strong>
              {(request.state.startDate && request.state.endDate
                ? `${request.state.startDate} – ${request.state.endDate}`
                : request.state.dates) || "À préciser"}
            </span>
          </p>
          <p>
            <VhpIcon name="pin" strokeWidth={1.5} />
            <span>
              <strong>{elmDemandeCopy.placeRecapLabel}</strong>
              {request.state.zone || "À préciser"}
            </span>
          </p>
          <p className="elm-recap__note">
            <VhpIcon name="file" strokeWidth={1.5} />
            <span>
              <strong>{elmDemandeCopy.tariffTitle}</strong>
              {elmDemandeCopy.tariffText}
            </span>
          </p>
          <figure className="elm-recap__visual">
            <Image
              src={elmSceneTerracePair.src}
              alt={elmSceneTerracePair.alt}
              width={elmSceneTerracePair.width}
              height={elmSceneTerracePair.height}
              sizes="320px"
              style={{ objectPosition: elmSceneTerracePair.objectPosition }}
            />
          </figure>
        </aside>
      </div>

      <section className="elm-why" aria-labelledby="elm-why-title">
        <h2 id="elm-why-title">
          {whyAccentAt >= 0 ? (
            <>
              {whyTitle.slice(0, whyAccentAt)}
              <span className="elm-underline">{whyAccent}</span>
              {whyTitle.slice(whyAccentAt + whyAccent.length)}
            </>
          ) : (
            whyTitle
          )}
        </h2>
        <ul>
          {why.map((item) => (
            <li key={item.id}>
              <div>
                <VhpIcon name={item.id === "souplesse" ? "calendar" : item.id === "fiables" ? "shieldCheck" : "truck"} />
                <strong>{item.title}</strong>
                <ul className="elm-why__points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <Image
                src={item.image.src}
                alt=""
                width={item.image.width}
                height={item.image.height}
                sizes="220px"
                style={{ objectPosition: item.image.objectPosition }}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
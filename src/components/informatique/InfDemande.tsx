"use client";

import { useEffect, useMemo, useState, type FormEvent, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  INF_CONFIRMATION_PATH,
  INF_DEMO_REFERENCE,
  INF_FAMILY_LABEL,
  INF_ROOT,
  infAislePath,
  infDemandeCopy,
  infPlaces,
  infRecapSummary,
  infSceneMeeting,
  infWhyImages,
} from "@/content/informatique";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import { infRequestMessage } from "@/lib/informatique-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useInfRequest } from "./InfRequest";

function AccentTitle({ title, accent, className }: { title: string; accent: string; className?: string }) {
  const accentAt = title.indexOf(accent);
  if (accentAt < 0) return <h1 className={className}>{title}</h1>;
  return (
    <h1 className={className}>
      {title.slice(0, accentAt)}
      <span className="inf-underline">{accent}</span>
      {title.slice(accentAt + accent.length)}
    </h1>
  );
}

export function InfDemande() {
  const router = useRouter();
  const request = useInfRequest();
  const submitCatalog = useCatalogFamilySubmit(INF_DEMO_REFERENCE);
  const recap = infRecapSummary(
    request.itemsWithProduct.map((item) => ({ id: item.id, quantity: item.quantity, title: item.title })),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const why = useMemo(
    () =>
      infDemandeCopy.why.map((item) => ({
        ...item,
        image: infWhyImages[item.image],
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
      router.replace(INF_ROOT);
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
        source: "informatique-demande",
        type: "RENTAL",
        contactName: request.state.name.trim(),
        contactPhone: request.state.phone.trim(),
        contactEmail: request.state.email.trim() || undefined,
        zone: request.state.zone.trim() || undefined,
        message: infRequestMessage(request.state),
        sourcePath: INF_CONFIRMATION_PATH,
        payload: {
          familyLabel: INF_FAMILY_LABEL,
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
      router.push(INF_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  };

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="inf-page inf-page--demande" aria-busy={!mounted} />;
  }

  const whyTitle = infDemandeCopy.whyTitle;
  const whyAccent = infDemandeCopy.whyTitleAccent;
  const whyAccentAt = whyTitle.indexOf(whyAccent);

  return (
    <div className="inf-page inf-page--demande">
      <header className="inf-demande-hero">
        <AccentTitle title={infDemandeCopy.title} accent={infDemandeCopy.titleAccent} className="inf-h1 inf-h1--demande" />
        <p className="inf-lead">{infDemandeCopy.lead}</p>
      </header>

      <div className="inf-demande-grid">
        <form className="inf-demande-form" onSubmit={onSubmit} noValidate>
          <section className="inf-card" aria-labelledby="inf-items-title">
            <h2 id="inf-items-title">{infDemandeCopy.itemsTitle}</h2>
            <ul className="inf-demande-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={72} height={72} className="inf-demande-items__thumb" />
                  <div>
                    <strong>{item.title}</strong>
                    <div className="inf-qty" role="group" aria-label={`Quantité pour ${item.title}`}>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity - 1)} aria-label="Diminuer">
                        <VhpIcon name="minus" strokeWidth={1.5} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity + 1)} aria-label="Augmenter">
                        <VhpIcon name="plus" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  <button type="button" className="inf-icon-btn" onClick={() => request.remove(item.id)} aria-label={`Retirer ${item.title}`}>
                    <VhpIcon name="trash" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href={INF_ROOT} className="inf-btn inf-btn--ghost inf-btn--small">
              <VhpIcon name="plus" strokeWidth={1.5} />
              {infDemandeCopy.addDevice}
            </Link>
          </section>

          <section className="inf-card inf-card--grid2">
            <label>
              <span>{infDemandeCopy.placeLabel}</span>
              <span className="inf-field--icon inf-field--select">
                <VhpIcon name="pin" strokeWidth={1.5} className="inf-search__icon" />
                <select value={request.state.zone} onChange={(event) => request.setMeta({ zone: event.target.value })} required>
                  <option value="">Choisir</option>
                  {infPlaces.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              <VhpIcon name="chevronDown" className="inf-field__caret" strokeWidth={1.8} /></span>
            </label>
            <label>
              <span>{infDemandeCopy.startLabel}</span>
              <span className="inf-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="inf-search__icon" />
                <input
                  type="date"
                  value={request.state.startDate}
                  onChange={(event) => request.setMeta({ startDate: event.target.value })}
                />
              </span>
            </label>
            <label>
              <span>{infDemandeCopy.endLabel}</span>
              <span className="inf-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="inf-search__icon" />
                <input type="date" value={request.state.endDate} onChange={(event) => request.setMeta({ endDate: event.target.value })} />
              </span>
            </label>
          </section>

          <section className="inf-card">
            <label>
              <span>{infDemandeCopy.usageLabel}</span>
              <textarea
                rows={4}
                value={request.state.usage}
                onChange={(event) => request.setMeta({ usage: event.target.value })}
                placeholder={infDemandeCopy.usagePlaceholder}
              />
            </label>
            <div className="inf-attach" role="group" aria-label={infDemandeCopy.attachLabel}>
              <VhpIcon name="file" strokeWidth={1.5} />
              <div>
                <strong>{infDemandeCopy.attachLabel}</strong>
                <p>{infDemandeCopy.attachHint}</p>
              </div>
            </div>
          </section>

          <section className="inf-card" aria-labelledby="inf-services-title">
            <h2 id="inf-services-title">{infDemandeCopy.servicesTitle}</h2>
            <ul className="inf-checks">
              {infDemandeCopy.services.map((service) => {
                const checked =
                  service.id === "delivery"
                    ? request.state.delivery
                    : service.id === "installation"
                      ? request.state.installation
                      : false;
                return (
                  <li key={service.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          if (service.id === "delivery") request.setMeta({ delivery: event.target.checked });
                          else if (service.id === "installation") request.setMeta({ installation: event.target.checked });
                        }}
                      />
                      <span>{service.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="inf-card inf-card--grid2" aria-labelledby="inf-contact-title">
            <h2 id="inf-contact-title">{infDemandeCopy.contactTitle}</h2>
            <label>
              <span>{infDemandeCopy.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                value={request.state.name}
                onChange={(event) => request.setMeta({ name: event.target.value })}
                required
              />
            </label>
            <label>
              <span>{infDemandeCopy.phoneLabel}</span>
              <input
                type="tel"
                autoComplete="tel"
                value={request.state.phone}
                onChange={(event) => request.setMeta({ phone: event.target.value })}
                required
              />
            </label>
            <label className="inf-span-2">
              <span>{infDemandeCopy.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                value={request.state.email}
                onChange={(event) => request.setMeta({ email: event.target.value })}
              />
            </label>
          </section>

          {error ? (
            <p className="inf-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="inf-demande-actions">
            <button type="submit" className="inf-btn inf-btn--yellow inf-btn--block" disabled={pending}>
              {pending ? "Envoi…" : infDemandeCopy.submit}
              <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
            </button>
            <Link href={infAislePath(request.itemsWithProduct[0].aisleId)} className="inf-btn inf-btn--ghost inf-btn--block">
              <VhpIcon name="notePen" strokeWidth={1.5} />
              {infDemandeCopy.edit}
            </Link>
          </div>
        </form>

        <aside className="inf-recap" aria-labelledby="inf-recap-title">
          <h2 id="inf-recap-title">{infDemandeCopy.recapTitle}</h2>
          <p className="inf-recap__headline">{recap.headline}</p>
          <p className="inf-recap__counts">{recap.counts}</p>
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
              <strong>{infDemandeCopy.periodLabel}</strong>
              {(request.state.startDate && request.state.endDate
                ? `${request.state.startDate} – ${request.state.endDate}`
                : request.state.dates) || "À préciser"}
            </span>
          </p>
          <p>
            <VhpIcon name="pin" strokeWidth={1.5} />
            <span>
              <strong>{infDemandeCopy.placeRecapLabel}</strong>
              {request.state.zone || "À préciser"}
            </span>
          </p>
          <p className="inf-recap__note">
            <VhpIcon name="file" strokeWidth={1.5} />
            <span>
              
              {infDemandeCopy.tariffNote}
            </span>
          </p>
          <figure className="inf-recap__visual">
            <Image
              src={infSceneMeeting.src}
              alt={infSceneMeeting.alt}
              width={infSceneMeeting.width}
              height={infSceneMeeting.height}
              sizes="320px"
              style={{ objectPosition: infSceneMeeting.objectPosition }}
            />
          </figure>
        </aside>
      </div>

      <section className="inf-why" aria-labelledby="inf-why-title">
        <h2 id="inf-why-title">
          {whyAccentAt >= 0 ? (
            <>
              {whyTitle.slice(0, whyAccentAt)}
              <span className="inf-underline">{whyAccent}</span>
              {whyTitle.slice(whyAccentAt + whyAccent.length)}
            </>
          ) : (
            whyTitle
          )}
        </h2>
        <ul>
          {why.map((item: (typeof why)[number]) => (
            <li key={item.id}>
              <div>
                <VhpIcon name={item.id === "productifs" ? "calendar" : item.id === "connectivite" ? "radar" : "calendar"} />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
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
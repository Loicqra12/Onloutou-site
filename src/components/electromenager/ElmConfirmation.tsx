"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ELM_DEMO_REFERENCE,
  ELM_ROOT,
  elmConfirmationCopy,
  elmDemandeWhatsAppMessage,
  elmDiscoverImages,
  elmProductPath,
  elmSceneTerracePair,
} from "@/content/electromenager";
import { whatsappUrlForMessage } from "@/content/contact-page";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useElmRequest } from "./ElmRequest";

export function ElmConfirmation() {
  const router = useRouter();
  const request = useElmRequest();
  const reference = request.state.reference || ELM_DEMO_REFERENCE;

  
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

  const discover = useMemo(
    () =>
      elmConfirmationCopy.discover.map((item) => ({
        label: item.label,
        href: elmProductPath(item.aisleId, item.productId),
        image: elmDiscoverImages[item.image],
      })),
    [],
  );

  const whatsappHref = whatsappUrlForMessage(
    elmDemandeWhatsAppMessage({
      reference,
      items: request.itemsWithProduct.map((item) => ({ title: item.title, quantity: item.quantity })),
      zone: request.state.zone,
      startDate: request.state.startDate,
      endDate: request.state.endDate || request.state.dates,
      delivery: request.state.delivery,
      name: request.state.name,
      phone: request.state.phone,
    }),
  );

  if (request.itemsWithProduct.length === 0) {
    return <div className="elm-page elm-page--confirm" />;
  }

  const period =
    request.state.startDate && request.state.endDate
      ? `Du ${formatFrDate(request.state.startDate)} au ${formatFrDate(request.state.endDate)}`
      : request.state.dates || "À préciser";

  const title = elmConfirmationCopy.title;
  const accent = elmConfirmationCopy.titleAccent;
  const accentAt = title.indexOf(accent);
  const discoverTitle = elmConfirmationCopy.discoverTitle;
  const discoverAccent = elmConfirmationCopy.discoverTitleAccent;
  const discoverAccentAt = discoverTitle.indexOf(discoverAccent);

  return (
    <div className="elm-page elm-page--confirm">
      <div className="elm-confirm-grid">
        <div className="elm-confirm-main">
          <header className="elm-confirm-hero">
            <span className="elm-confirm-badge" aria-hidden>
              <VhpIcon name="check" strokeWidth={1.5} />
            </span>
            <h1 className="elm-h1 elm-h1--demande">
              {accentAt >= 0 ? (
                <>
                  {title.slice(0, accentAt)}
                  <span className="elm-underline">{accent}</span>
                  {title.slice(accentAt + accent.length)}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="elm-lead">{elmConfirmationCopy.lead}</p>
          </header>

          <article className="elm-confirm-card">
            <div className="elm-confirm-ref">
              <span>{elmConfirmationCopy.referenceLabel}</span>
              <strong>{reference}</strong>
            </div>
            <ul className="elm-confirm-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={64} height={64} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>Quantité : {item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="elm-confirm-meta">
              <div>
                <dt>
                  <VhpIcon name="pin" strokeWidth={1.5} /> {elmConfirmationCopy.placeLabel}
                </dt>
                <dd>{request.state.zone || "À préciser"}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {elmConfirmationCopy.periodLabel}
                </dt>
                <dd>{period}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="truck" strokeWidth={1.5} /> {elmConfirmationCopy.deliveryLabel}
                </dt>
                <dd>{request.state.delivery ? elmConfirmationCopy.deliveryYes : elmConfirmationCopy.deliveryNo}</dd>
              </div>
            </dl>
          </article>
        </div>

        <figure className="elm-confirm-visual">
          <Image
            src={elmSceneTerracePair.src}
            alt={elmSceneTerracePair.alt}
            width={elmSceneTerracePair.width}
            height={elmSceneTerracePair.height}
            sizes="(max-width : 900px) 100vw, 42vw"
            priority
            style={{ objectPosition: elmSceneTerracePair.objectPosition }}
          />
        </figure>
      </div>

      <div className="elm-confirm-actions">
        <a href={whatsappHref} className="elm-btn elm-btn--yellow elm-btn--block" target="_blank" rel="noopener noreferrer">
          <VhpIcon name="whatsapp" strokeWidth={1.5} />
          {elmConfirmationCopy.whatsapp}
        </a>
        <Link href={ELM_ROOT} className="elm-btn elm-btn--ghost elm-btn--block">
          ← {elmConfirmationCopy.back}
        </Link>
      </div>

      <ul className="elm-confirm-values">
        {elmConfirmationCopy.values.map((item, index) => (
          <li key={item.title}>
            <VhpIcon name={index === 0 ? "truck" : index === 1 ? "gear" : "calendar"} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <section className="elm-discover" aria-labelledby="elm-discover-title">
        <h2 id="elm-discover-title" className="elm-h2">
          {discoverAccentAt >= 0 ? (
            <>
              {discoverTitle.slice(0, discoverAccentAt)}
              <span className="elm-underline">{discoverAccent}</span>
              {discoverTitle.slice(discoverAccentAt + discoverAccent.length)}
            </>
          ) : (
            discoverTitle
          )}
        </h2>
        <ul>
          {discover.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="elm-discover__card">
                <Image
                  src={item.image.src}
                  alt=""
                  width={item.image.width}
                  height={item.image.height}
                  sizes="25vw"
                  style={{ objectPosition: item.image.objectPosition }}
                />
                <span>
                  {item.label}
                  <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function formatFrDate(value: string) {
  const date = new Date(`${value}T12 :00 :00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  INF_DEMO_REFERENCE,
  INF_ROOT,
  infConfirmationCopy,
  infDemandeWhatsAppMessage,
  infDiscoverImages,
  infProductPath,
  infSceneMeeting,
} from "@/content/informatique";
import { whatsappUrlForMessage } from "@/content/contact-page";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useInfRequest } from "./InfRequest";

export function InfConfirmation() {
  const router = useRouter();
  const request = useInfRequest();
  const reference = request.state.reference || INF_DEMO_REFERENCE;

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

  const discover = useMemo(
    () =>
      infConfirmationCopy.discover.map((item) => ({
        label: item.label,
        href: infProductPath(item.aisleId, item.productId),
        image: infDiscoverImages[item.image],
      })),
    [],
  );

  const whatsappHref = whatsappUrlForMessage(
    infDemandeWhatsAppMessage({
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

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="inf-page inf-page--confirm" aria-busy={!mounted} />;
  }

  const period =
    request.state.startDate && request.state.endDate
      ? `Du ${formatFrDate(request.state.startDate)} au ${formatFrDate(request.state.endDate)}`
      : request.state.dates || "À préciser";

  const title = infConfirmationCopy.title;
  const accent = infConfirmationCopy.titleAccent;
  const accentAt = title.indexOf(accent);
  const discoverTitle = infConfirmationCopy.discoverTitle;
  const discoverAccent = infConfirmationCopy.discoverTitleAccent;
  const discoverAccentAt = discoverTitle.indexOf(discoverAccent);

  return (
    <div className="inf-page inf-page--confirm">
      <div className="inf-confirm-grid">
        <div className="inf-confirm-main">
          <header className="inf-confirm-hero">
            <span className="inf-confirm-badge" aria-hidden>
              <VhpIcon name="check" strokeWidth={1.5} />
            </span>
            <h1 className="inf-h1 inf-h1--demande">
              {accentAt >= 0 ? (
                <>
                  {title.slice(0, accentAt)}
                  <span className="inf-underline">{accent}</span>
                  {title.slice(accentAt + accent.length)}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="inf-lead">{infConfirmationCopy.lead}</p>
          </header>

          <article className="inf-confirm-card">
            <div className="inf-confirm-ref">
              <span>{infConfirmationCopy.referenceLabel}</span>
              <strong>{reference}</strong>
            </div>
            <ul className="inf-confirm-items">
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
            <dl className="inf-confirm-meta">
              <div>
                <dt>
                  <VhpIcon name="pin" strokeWidth={1.5} /> {infConfirmationCopy.placeLabel}
                </dt>
                <dd>{request.state.zone || "À préciser"}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {infConfirmationCopy.periodLabel}
                </dt>
                <dd>{period}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="truck" strokeWidth={1.5} /> {infConfirmationCopy.deliveryLabel}
                </dt>
                <dd>{request.state.delivery ? infConfirmationCopy.deliveryYes : infConfirmationCopy.deliveryNo}</dd>
              </div>
            </dl>
          </article>
        </div>

        <figure className="inf-confirm-visual">
          <Image
            src={infSceneMeeting.src}
            alt={infSceneMeeting.alt}
            width={infSceneMeeting.width}
            height={infSceneMeeting.height}
            sizes="(max-width : 900px) 100vw, 42vw"
            priority
            style={{ objectPosition: infSceneMeeting.objectPosition }}
          />
        </figure>
      </div>

      <div className="inf-confirm-actions">
        <a href={whatsappHref} className="inf-btn inf-btn--yellow inf-btn--block" target="_blank" rel="noopener noreferrer">
          <VhpIcon name="whatsapp" strokeWidth={1.5} />
          {infConfirmationCopy.whatsapp}
        </a>
        <Link href={INF_ROOT} className="inf-btn inf-btn--ghost inf-btn--block">
          ← {infConfirmationCopy.back}
        </Link>
      </div>

      <ul className="inf-confirm-values">
        {infConfirmationCopy.values.map((item, index) => (
          <li key={item.title}>
            <VhpIcon name={index === 0 ? "truck" : index === 1 ? "gear" : "calendar"} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <section className="inf-discover" aria-labelledby="inf-discover-title">
        <h2 id="inf-discover-title" className="inf-h2">
          {discoverAccentAt >= 0 ? (
            <>
              {discoverTitle.slice(0, discoverAccentAt)}
              <span className="inf-underline">{discoverAccent}</span>
              {discoverTitle.slice(discoverAccentAt + discoverAccent.length)}
            </>
          ) : (
            discoverTitle
          )}
        </h2>
        <ul>
          {discover.map((item: (typeof discover)[number]) => (
            <li key={item.label}>
              <Link href={item.href} className="inf-discover__card">
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
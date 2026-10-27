import { Button } from "@/components/ui/Button";
import {
  driverDataProtectionSection,
  driverFieldSafetySection,
  driverMissionFramingSection,
  driverOrientationSection,
  driverPaymentsSection,
  driverPortalFinalCta,
} from "@/content/driver-portal-page";

export function DriverMissionFramingBlock() {
  const data = driverMissionFramingSection;
  return (
    <section className="edl-framing section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="edl-framing-title">
      <div className="container-content">
        <h2 id="edl-framing-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="edl-framing__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="edl-framing__notice">{data.notice}</p>
      </div>
    </section>
  );
}

export function DriverPaymentsBlock() {
  const data = driverPaymentsSection;
  return (
    <section className="edl-payments section-spacing bg-brand-off-white" aria-labelledby="edl-payments-title">
      <div className="container-content">
        <p className="edl-payments__status">{data.moduleStatus}</p>
        <h2 id="edl-payments-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="edl-payments__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="edl-payments__notice">{data.notice}</p>
      </div>
    </section>
  );
}

export function DriverFieldSafetyBlock() {
  const data = driverFieldSafetySection;
  return (
    <section className="edl-safety section-spacing bg-brand-white" aria-labelledby="edl-safety-title">
      <div className="container-content">
        <h2 id="edl-safety-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="edl-safety__list">
          {data.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function DriverDataProtectionBlock() {
  const data = driverDataProtectionSection;
  return (
    <section className="edl-data section-spacing bg-brand-off-white" aria-labelledby="edl-data-title">
      <div className="container-content">
        <h2 id="edl-data-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="edl-data__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="edl-data__notice">{data.notice}</p>
      </div>
    </section>
  );
}

export function DriverOrientationBlock() {
  const data = driverOrientationSection;
  return (
    <section className="edl-orientation section-spacing bg-brand-white" aria-labelledby="edl-orientation-become">
      <div className="container-content edl-orientation__grid">
        <article className="edl-orientation__card">
          <h3 id="edl-orientation-become" className="edl-orientation__title">{data.become.title}</h3>
          <p>{data.become.lead}</p>
          <Button href={data.become.cta.href} variant="primary">{data.become.cta.label}</Button>
        </article>
        <article className="edl-orientation__card">
          <h3 className="edl-orientation__title">{data.delivery.title}</h3>
          <p>{data.delivery.lead}</p>
          <Button href={data.delivery.cta.href} variant="outline">{data.delivery.cta.label}</Button>
        </article>
      </div>
    </section>
  );
}

export function DriverPortalFinalCtaBlock() {
  const data = driverPortalFinalCta;
  return (
    <section className="edl-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="edl-final-title">
      <div className="container-content edl-final__inner">
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <h2 id="edl-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="edl-final__lead">{data.lead}</p>
        <div className="edl-final__actions">
          <Button href={data.primary.href} variant="primary">{data.primary.label}</Button>
          <Button href={data.secondary.href} variant="outline">{data.secondary.label}</Button>
        </div>
        <a href={data.contact.href} className="edl-final__contact link-motion">{data.contact.label}</a>
        <a href={data.help.href} className="edl-final__contact link-motion">{data.help.label}</a>
      </div>
    </section>
  );
}

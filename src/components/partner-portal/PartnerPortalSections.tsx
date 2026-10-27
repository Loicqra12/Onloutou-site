import { Button } from "@/components/ui/Button";
import {
  partnerJourneyNotice,
  partnerJourneySection,
  partnerOrientationSection,
  partnerPortalFinalCta,
  partnerSecuritySection,
  partnerSponsoringSection,
  partnerSubscriptionSection,
} from "@/content/partner-portal-page";

export function PartnerSubscriptionSectionBlock() {
  const data = partnerSubscriptionSection;
  return (
    <section
      id="epp-section-subscription"
      className="epp-public-module section-spacing bg-brand-off-white"
      aria-labelledby="epp-subscription-title"
    >
      <div className="container-content epp-public-module__inner">
        <p className="epp-public-module__status">{data.status}</p>
        <h2 id="epp-subscription-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="epp-public-module__lead">{data.lead}</p>
        <ul className="epp-public-module__list">
          {data.criteria.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PartnerSponsoringSectionBlock() {
  const data = partnerSponsoringSection;
  return (
    <section
      id="epp-section-sponsoring"
      className="epp-public-module section-spacing bg-brand-charcoal text-brand-white"
      aria-labelledby="epp-sponsoring-title"
    >
      <div className="container-content epp-public-module__inner">
        <p className="epp-public-module__status epp-public-module__status--light">{data.status}</p>
        <h2 id="epp-sponsoring-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="epp-public-module__lead epp-public-module__lead--light">{data.lead}</p>
        <ol className="epp-public-module__steps">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PartnerSecuritySectionBlock() {
  const data = partnerSecuritySection;
  return (
    <section className="epp-security section-spacing bg-brand-white" aria-labelledby="epp-security-title">
      <div className="container-content">
        <h2 id="epp-security-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="epp-security__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="epp-security__notice">{data.notice}</p>
      </div>
    </section>
  );
}

export function PartnerOrientationSectionBlock() {
  const data = partnerOrientationSection;
  return (
    <section className="epp-orientation section-spacing bg-brand-off-white" aria-labelledby="epp-orientation-title">
      <div className="container-content">
        <div className="epp-orientation__grid">
          <article className="epp-orientation__card">
            <h3 className="epp-orientation__card-title">{data.become.title}</h3>
            <p>{data.become.lead}</p>
            <Button href={data.become.cta.href} variant="primary">{data.become.cta.label}</Button>
          </article>
          <article className="epp-orientation__card">
            <h3 className="epp-orientation__card-title">{data.existing.title}</h3>
            <p>{data.existing.lead}</p>
            <Button href={data.existing.cta.href} variant="outline">{data.existing.cta.label}</Button>
          </article>
        </div>
      </div>
    </section>
  );
}

export function PartnerPortalFinalCtaBlock() {
  const data = partnerPortalFinalCta;
  return (
    <section className="epp-final section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="epp-final-title">
      <div className="container-content epp-final__inner">
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <h2 id="epp-final-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="epp-final__lead">{data.lead}</p>
        <div className="epp-final__actions">
          <Button href={data.primary.href} variant="primary">{data.primary.label}</Button>
          <Button href={data.secondary.href} variant="outline">{data.secondary.label}</Button>
        </div>
        <a href={data.contact.href} className="epp-final__contact link-motion">{data.contact.label}</a>
        <a href={data.help.href} className="epp-final__contact link-motion">{data.help.label}</a>
      </div>
    </section>
  );
}

export { partnerJourneySection, partnerJourneyNotice };

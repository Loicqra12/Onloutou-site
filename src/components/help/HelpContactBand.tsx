import { Button } from "@/components/ui/Button";
import { helpCenterWhatsappUrl, helpContactEscalation } from "@/content/help-center";

export function HelpContactBand() {
  const data = helpContactEscalation;

  return (
    <section className="hlp-contact section-spacing bg-brand-off-white" aria-labelledby="hlp-contact-title">
      <div className="container-content max-w-3xl hlp-contact__inner">
        <h2 id="hlp-contact-title" className="font-display text-3xl font-extrabold tracking-tight">
          {data.title}
        </h2>
        <p className="hlp-contact__lead">{data.lead}</p>
        <div className="hlp-contact__actions">
          <Button href={data.primaryCta.href} variant="primary">{data.primaryCta.label}</Button>
          <a href={helpCenterWhatsappUrl()} className="hlp-contact__whatsapp link-motion" rel="noopener noreferrer">
            {data.whatsappCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

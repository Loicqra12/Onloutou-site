import { Reveal } from "@/components/motion/Reveal";
import { deliveryAudiencePaths } from "@/content/delivery-page";

export function DeliveryAudienceSwitch() {
  const { client, driver } = deliveryAudiencePaths;

  return (
    <section className="dlv-audience" aria-labelledby="dlv-audience-title">
      <h2 id="dlv-audience-title" className="sr-only">Choisir votre parcours</h2>
      <div className="dlv-audience__grid">
        <Reveal className="dlv-audience__panel dlv-audience__panel--client">
          <p className="dlv-audience__eyebrow">Demandeur</p>
          <h3 className="dlv-audience__title font-display font-extrabold">{client.title}</h3>
          <p className="dlv-audience__lead">{client.lead}</p>
          <a href={client.cta.href} className="dlv-audience__cta link-motion">{client.cta.label}</a>
        </Reveal>
        <div className="dlv-audience__bridge" aria-hidden />
        <Reveal delay={80} className="dlv-audience__panel dlv-audience__panel--driver">
          <p className="dlv-audience__eyebrow">Livreur ou partenaire logistique</p>
          <h3 className="dlv-audience__title font-display font-extrabold">{driver.title}</h3>
          <p className="dlv-audience__lead">{driver.lead}</p>
          <a href={driver.cta.href} className="dlv-audience__cta link-motion">{driver.cta.label}</a>
        </Reveal>
      </div>
    </section>
  );
}

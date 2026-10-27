import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesFaq, salesFaqAside, salesFaqHighlight, salesFaqTitle } from "@/content/sales-page";

export function SalesFaq() {
  return (
    <section className="sales-faq section-spacing" aria-labelledby="service-faq-title">
      <div className="container-content sales-faq__grid">
        <div className="sales-faq__intro">
          <p className="sales-eyebrow">Questions fréquentes</p>
          <TitleReveal as="h2" id="service-faq-title" className="sales-faq__title font-display font-extrabold tracking-tight">
            <MarkedPhrase text={salesFaqTitle} highlight={salesFaqHighlight} />
          </TitleReveal>
          <p className="sales-faq__lead">{salesFaqAside.text}</p>
          <Button href={salesFaqAside.cta.href} variant="outline" className="sales-faq__cta">
            {salesFaqAside.cta.label}
            <span aria-hidden> ↗</span>
          </Button>
        </div>
        <div className="sales-faq__list">
          {salesFaq.map((item, index) => (
            <details key={item.question} open={index === 0 ? true : undefined} className="sales-faq__item">
              <summary>{item.question}</summary>
              <div className="sales-faq__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

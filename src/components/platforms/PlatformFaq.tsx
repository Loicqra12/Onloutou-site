import { TitleReveal } from "@/components/motion/TitleReveal";
import { customPlatformsFaq, customPlatformsFaqIntro } from "@/content/custom-platforms-page";

export function PlatformFaq() {
  return (
    <section className="platform-faq section-spacing" aria-labelledby="service-faq-title">
      <div className="container-content platform-faq__grid">
        <div className="platform-faq__intro">
          <p className="platform-kicker">{customPlatformsFaqIntro.eyebrow}</p>
          <TitleReveal as="h2" id="service-faq-title" className="platform-faq__title font-display font-extrabold tracking-tight">
            {customPlatformsFaqIntro.title}
          </TitleReveal>
          <p className="platform-faq__lead">{customPlatformsFaqIntro.lead}</p>
        </div>
        <div className="platform-faq__list">
          {customPlatformsFaq.map((item, index) => (
            <details key={item.question} open={index === 0 ? true : undefined} className="platform-faq__item">
              <summary>{item.question}</summary>
              <div className="platform-faq__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

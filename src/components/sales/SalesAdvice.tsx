import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { salesAdvice } from "@/content/sales-page";

export function SalesAdvice() {
  return (
    <section id={salesAdvice.id} className="cm-section cm-advice scroll-mt-28" aria-labelledby="sales-advice-title">
      <div className="cm-wrap">
        <p className="cm-eyebrow cm-eyebrow--dark">{salesAdvice.eyebrow}</p>
        <h2 id="sales-advice-title" className="cm-h2">
          {salesAdvice.title}
        </h2>
        <p className="cm-lead">{salesAdvice.lead}</p>

        <ol className="cm-advice__list">
          {salesAdvice.questions.map((question, index) => (
            <Reveal as="li" key={question.title} delay={index * 70} className="cm-advice__item">
              <span className="cm-advice__num" aria-hidden>
                {index + 1}
              </span>
              <h3>{question.title}</h3>
              <ul>
                {question.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <div className="cm-actions cm-actions--row">
          <a href={salesAdvice.cta.href} className="cm-btn cm-btn--primary">
            {salesAdvice.cta.label}
          </a>
          <p className="cm-rentlink">
            {salesAdvice.rentLink.lead}{" "}
            <Link href={salesAdvice.rentLink.href} className="link-motion">
              {salesAdvice.rentLink.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

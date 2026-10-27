import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesProcess } from "@/content/sales-page";

export function SelectionProcess() {
  return (
    <section className="sales-process section-spacing" aria-labelledby="sales-process-title">
      <div className="container-content">
        <p className="sales-eyebrow">Notre méthode</p>
        <TitleReveal as="h2" id="sales-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <MarkedPhrase text={salesProcess.title} highlight={salesProcess.titleHighlight} />
        </TitleReveal>
        <ol className="sales-process__timeline">
          {salesProcess.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 50} as="li" className="sales-process__step">
              <span className="sales-process__num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="sales-process__content">
                <h3 className="sales-process__step-title">{step.title}</h3>
                <p className="sales-process__step-text">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

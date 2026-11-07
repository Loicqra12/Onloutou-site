import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { IlluConfirm, IlluDescribe, IlluPropose, IlluStudy } from "@/components/illustrations/StepIllustrations";
import { rentalProcess } from "@/content/rental-page";

const STEP_TITLES = ["Décrire", "Qualifier", "Proposer", "Confirmer"];
const ILLUSTRATIONS: ReactNode[] = [<IlluDescribe key="d" />, <IlluStudy key="s" />, <IlluPropose key="p" />, <IlluConfirm key="c" />];

export function RentalProcess() {
  const steps = STEP_TITLES.map((title) => rentalProcess.steps.find((step) => step.title === title)).filter(
    (step): step is (typeof rentalProcess.steps)[number] => Boolean(step),
  );

  return (
    <section id="etapes-location" className="cm-section cm-steps scroll-mt-28" aria-labelledby="rental-process-title">
      <div className="cm-wrap">
        <p className="cm-eyebrow cm-eyebrow--dark">La location en 4 étapes</p>
        <h2 id="rental-process-title" className="cm-h2">
          {rentalProcess.title}
        </h2>
        <ol className="cm-steps__list">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 70} className="cm-steps__item">
              <div className="step-illu" aria-hidden>
                {ILLUSTRATIONS[index]}
              </div>
              <span className="cm-steps__num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

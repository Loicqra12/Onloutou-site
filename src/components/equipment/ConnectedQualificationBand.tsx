import { Reveal } from "@/components/motion/Reveal";
import { connectedQuickQuestions } from "@/content/connected-equipment-page";

export function ConnectedQualificationBand() {
  return (
    <section className="cec-band" aria-labelledby="cec-band-title">
      <div className="container-content">
        <h2 id="cec-band-title" className="sr-only">Critères de qualification</h2>
        <ol className="cec-band__list">
          {connectedQuickQuestions.map((q, index) => (
            <Reveal key={q} as="li" delay={index * 45} className="cec-band__item">
              <span className="cec-band__num">{index + 1}</span>
              {q}
            </Reveal>
          ))}
        </ol>
        <span className="cec-band__progress" aria-hidden />
      </div>
    </section>
  );
}

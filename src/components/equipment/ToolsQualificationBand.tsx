import { Reveal } from "@/components/motion/Reveal";
import { toolsQualificationQuestions } from "@/content/tools-equipment-page";

export function ToolsQualificationBand() {
  return (
    <section className="tem-qual-band" aria-labelledby="tem-qual-band-title">
      <div className="container-content">
        <h2 id="tem-qual-band-title" className="sr-only">Questions de qualification</h2>
        <ol className="tem-qual-band__list">
          {toolsQualificationQuestions.map((q, index) => (
            <Reveal key={q} delay={index * 40} as="li" className="tem-qual-band__item">
              <span className="tem-qual-band__num">{index + 1}</span>
              <span>{q}</span>
            </Reveal>
          ))}
        </ol>
        <span className="tem-qual-band__progress" aria-hidden />
      </div>
    </section>
  );
}

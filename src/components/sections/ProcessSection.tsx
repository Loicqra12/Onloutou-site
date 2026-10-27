import { processIntro, processSteps } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProcessSection() {
  return (
    <section className="bg-brand-white py-20 sm:py-28">
      <div className="container-content">
        <SectionHeading
          number={processIntro.number}
          eyebrow={processIntro.eyebrow}
          title={processIntro.title}
          compact
        />
        <div className="grid border-t border-[#d4d4d4] sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article
              key={step.number}
              className={`min-h-[220px] py-7 ${
                index < processSteps.length - 1
                  ? "border-b border-[#dddddd] sm:border-b-0 sm:border-r"
                  : ""
              } ${index > 0 ? "sm:pl-6" : ""}`}
            >
              <b className="font-display text-4xl font-extrabold text-[#dedede]">
                {step.number}
              </b>
              <span className="mt-5 block text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#997b00]">
                {step.phase}
              </span>
              <h3 className="mt-2 font-display text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#777777]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
  expertiseCases,
  expertiseFlow,
  expertiseIntro,
} from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

export function ExpertiseSection() {
  return (
    <section id="expertise" className="bg-brand-charcoal py-20 text-white sm:py-28">
      <div className="container-content">
        <SectionHeading
          number={expertiseIntro.number}
          eyebrow={expertiseIntro.eyebrow}
          title={expertiseIntro.title}
          markerHighlight={expertiseIntro.titleHighlight}
          description={expertiseIntro.description}
          light
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {expertiseCases.map((item, index) => (
            <Reveal
              key={item.index}
              as="article"
              delay={index * 90}
              className={`expertise-card-motion relative overflow-hidden rounded-[18px] border p-8 ${
                item.variant === "featured"
                  ? "border-transparent bg-brand-yellow text-brand-ink lg:col-span-2"
                  : "border-[#333333] bg-[#171717]"
              }`}
            >
              <div
                className={`absolute right-6 top-5 font-display text-6xl font-extrabold ${
                  item.variant === "featured"
                    ? "text-black/10"
                    : "text-white/5"
                }`}
                aria-hidden
              >
                {item.index}
              </div>
              <Tag dark={item.variant !== "featured"}>{item.tag}</Tag>
              <h3 className="mt-6 max-w-2xl font-display text-3xl font-extrabold leading-tight">
                {item.title}
              </h3>
              <p
                className={`mt-4 max-w-3xl text-sm leading-relaxed sm:text-base ${
                  item.variant === "featured" ? "text-[#332b0d]" : "text-[#aaaaaa]"
                }`}
              >
                {item.description}
              </p>
              {item.variant === "featured" && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {expertiseFlow.map((step, index) => (
                    <span key={step} className="inline-flex items-center gap-2">
                      <span className="rounded bg-brand-ink px-3 py-2 text-[10px] font-bold text-white">
                        {step}
                      </span>
                      {index < expertiseFlow.length - 1 && (
                        <span className="hidden text-brand-ink sm:inline" aria-hidden>
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              {item.index === "02" && (
                <div className="mt-8 flex h-[85px] items-end gap-2" aria-hidden>
                  {[32, 54, 46, 78, 68, 91].map((height) => (
                    <span
                      key={height}
                      className="flex-1 rounded-t bg-brand-yellow"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              )}
              {item.index === "03" && (
                <div className="mt-8 grid gap-2">
                  {["01 Cadrer", "02 Prototyper", "03 Déployer"].map((step) => (
                    <span
                      key={step}
                      className="rounded bg-[#242424] px-3 py-2 text-[10px] text-[#dddddd]"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

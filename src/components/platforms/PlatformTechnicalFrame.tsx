import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformIcon } from "@/components/platforms/PlatformIcons";
import { customPlatformsTechnical } from "@/content/custom-platforms-page";

const techIcons = ["data", "cloud", "shield", "support"];

export function PlatformTechnicalFrame() {
  return (
    <section
      id="cadre-technique"
      className="platform-technical section-spacing"
      aria-labelledby="platform-technical-title"
    >
      <div className="container-content">
        <p className="platform-kicker platform-kicker--on-dark">Le cadre du projet</p>
        <TitleReveal as="h2" id="platform-technical-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformsTechnical.title}
        </TitleReveal>
        <ul className="platform-technical__groups">
          {customPlatformsTechnical.groups.map((group, index) => (
            <li key={group.title} className="platform-technical__group">
              <span className="platform-technical__icon">
                <PlatformIcon name={techIcons[index] ?? "gear"} />
              </span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="platform-technical__note">{customPlatformsTechnical.note}</p>
      </div>
    </section>
  );
}

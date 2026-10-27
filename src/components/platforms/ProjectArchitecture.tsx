import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformIcon } from "@/components/platforms/PlatformIcons";
import { customPlatformsArchitecture } from "@/content/custom-platforms-page";

const archIcons = ["users", "screen", "ops", "data", "gear"];

export function ProjectArchitecture() {
  return (
    <section
      id="architecture-fonctionnelle"
      className="platform-arch section-spacing scroll-mt-28"
      aria-labelledby="platform-arch-title"
    >
      <div className="container-content">
        <p className="platform-kicker">Une information bien organisée</p>
        <TitleReveal as="h2" id="platform-arch-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformsArchitecture.title}
        </TitleReveal>

        <p className="sr-only">
          Schéma fonctionnel : utilisateurs, interfaces, services métier, données et intégrations.
        </p>

        <ol className="platform-arch__cards">
          {customPlatformsArchitecture.levels.map((level, index) => (
            <li key={level.title} className="platform-arch__card">
              <span className="platform-arch__icon">
                <PlatformIcon name={archIcons[index] ?? "ops"} />
              </span>
              <h3>{level.title}</h3>
              <ul>
                {level.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="platform-arch__note">{customPlatformsArchitecture.note}</p>
      </div>
    </section>
  );
}

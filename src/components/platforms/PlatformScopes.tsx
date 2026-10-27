import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformIcon } from "@/components/platforms/PlatformIcons";
import { customPlatformsScopeGroups } from "@/content/custom-platforms-page";

const groupIcons = ["users", "ops", "plug"];

export function PlatformScopes() {
  return (
    <section
      id="perimetres-etudies"
      className="platform-scopes section-spacing"
      aria-labelledby="platform-scopes-title"
    >
      <div className="container-content">
        <p className="platform-kicker">Un périmètre à construire</p>
        <TitleReveal as="h2" id="platform-scopes-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Périmètres pouvant être étudiés
        </TitleReveal>
        <ul className="platform-scopes__groups">
          {customPlatformsScopeGroups.map((group, index) => (
            <li key={group.title} className="platform-scopes__group">
              <span className="platform-scopes__icon">
                <PlatformIcon name={groupIcons[index] ?? "ops"} />
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
      </div>
    </section>
  );
}

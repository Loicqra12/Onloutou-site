import { abtFurther, abtIds } from "@/content/about-hub";
import { AbtLink } from "./AbtHero";

export function AbtFurther() {
  return (
    <div id={abtIds.further} className="abt-further">
      <span id="about-references" className="abt-alias" aria-hidden="true" />
      <nav className="abt-further__bar" aria-label={abtFurther.title}>
        <p className="abt-further__title">{abtFurther.title}</p>
        <ul className="abt-further__list">
          {abtFurther.links.map((link) => (
            <li key={link.label}>
              <AbtLink href={link.href}>{link.label}</AbtLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
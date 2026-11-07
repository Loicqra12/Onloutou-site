import Link from "next/link";
import { homBuild, homIds } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";
import { HomTitle } from "@/components/home/redesign/HomMark";

export function HomBuild() {
  return (
    <section id={homIds.build} data-section="build" className="hom-build" aria-labelledby="hom-build-title">
      <span className="hom-stars" aria-hidden />
      <div className="hom-wrap hom-wrap--above">
        <div className="hom-titleblock">
          <p className="hom-eyebrow hom-eyebrow--yellow hom-eyebrow--rule-before">{homBuild.eyebrow}</p>
          <h2 id="hom-build-title" className="hom-h2 hom-h2--xl hom-h2--light">
            <HomTitle text={homBuild.title} mark={homBuild.titleMark} variant="word" />
          </h2>
          <p className="hom-build__lead">{homBuild.lead}</p>
        </div>
        <p className="hom-build__label">{homBuild.modulesTitle}</p>
        <ul className="hom-build__grid">
          {homBuild.modules.map((module) => (
            <li key={module.title}>
              <article className="hom-module">
                <HomIcon name={module.icon} className="hom-module__icon" />
                <h3>{module.title}</h3>
                <p>{module.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <div className="hom-build__foot">
          <div>
            <p className="hom-build__projects">
              <strong>{homBuild.projects.label}</strong> {homBuild.projects.names.join(" · ")}
            </p>
            <p className="hom-build__note">{homBuild.projects.note}</p>
          </div>
          <Link href={homBuild.cta.href} className="hom-btn hom-btn--yellow">
            {homBuild.cta.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
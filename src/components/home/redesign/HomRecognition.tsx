import Link from "next/link";
import { homRecognition } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomRecognition() {
  return (
    <section id="distinctions-accueil" className="hom-recog" aria-labelledby="hom-recog-title">
      <div className="hom-wrap">
        <div className="hom-titleblock">
          <p className="hom-eyebrow hom-eyebrow--rule-after">{homRecognition.eyebrow}</p>
          <h2 id="hom-recog-title" className="hom-h2 hom-h2--xl">
            {homRecognition.title}
          </h2>
          <p className="hom-recog__lead">{homRecognition.lead}</p>
        </div>

        <ul className="hom-recog__grid">
          {homRecognition.cards.map((card) => (
            <li key={card.title} className="hom-recog__card">
              <span className={`hom-recog__icon hom-recog__icon--${card.icon}`}>
                <HomIcon name={card.icon} />
              </span>
              <span className="hom-recog__body">
                <strong>{card.title}</strong>
                <span className={`hom-pill hom-pill--${card.tone}`}>{card.status}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="hom-recog__cta">
          <Link href={homRecognition.cta.href} className="hom-link">
            {homRecognition.cta.label}
            <HomIcon name="arrowUpRight" className="hom-link__icon" />
          </Link>
        </div>

        <div className="hom-bcp">
          <span className="hom-bcp__play" aria-hidden>
            <HomIcon name="play" />
          </span>
          <span className="hom-bcp__text">
            <strong>{homRecognition.video.title}</strong>
            <span>{homRecognition.video.detail}</span>
          </span>
          <a
            href={homRecognition.video.link.href}
            className="hom-link hom-link--small hom-bcp__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {homRecognition.video.link.label}
            <HomIcon name="arrowUpRight" className="hom-link__icon" />
            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
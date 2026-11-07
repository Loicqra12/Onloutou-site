import Link from "next/link";
import { expServices } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";
import { ExpPicture } from "./ExpPicture";

export function ExpServices() {
  return (
    <section id={expServices.id} className="exp-services" aria-labelledby="exp-services-title">
      <header className="exp-head">
        <p className="exp-eyebrow">{expServices.kicker}</p>
        <h2 id="exp-services-title" className="exp-h2">
          {expServices.title}
        </h2>
        <p className="exp-lead">{expServices.lead}</p>
      </header>

      <ul className="exp-cards">
        {expServices.items.map((item, index) => (
          <li key={item.id} id={item.id} className="exp-card">
            <ExpPicture
              id={item.image}
              alt={item.alt}
              scene={`card-${index + 1}`}
              sizes="(max-width: 700px) 92vw, 46vw"
            />
            <div className="exp-card__body">
              <div className="exp-card__top">
                <span className="exp-card__number" aria-hidden="true">
                  {item.number}
                </span>
                <div className="exp-card__copy">
                  <ExpIcon name={item.icon} className="exp-card__icon" />
                  <h3 className="exp-h3">{item.title}</h3>
                  <p className="exp-card__text">{item.text}</p>
                </div>
              </div>
              <div className="exp-card__preview">
                <ExpIcon name="chat" className="exp-card__preview-icon" />
                <p>
                  <strong>{expServices.previewLabel}</strong>
                  <span>{item.preview}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="exp-associated">
        <div className="exp-associated__copy">
          <h3 className="exp-associated__title">{expServices.associated.title}</h3>
          <p className="exp-associated__text">{expServices.associated.text}</p>
        </div>
        <ul className="exp-associated__links">
          {expServices.associated.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="exp-btn exp-btn--outline">
                {link.label}
                <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="exp-combine">
        <ExpIcon name="nodes" className="exp-combine__icon" />
        <p className="exp-combine__text">{expServices.combine.text}</p>
        <Link href={expServices.combine.cta.href} className="exp-btn exp-btn--yellow">
          {expServices.combine.cta.label}
          <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
        </Link>
      </div>
    </section>
  );
}
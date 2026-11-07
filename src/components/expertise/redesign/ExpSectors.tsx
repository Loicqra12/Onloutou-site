import Link from "next/link";
import { expSectors } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";
import { ExpPicture } from "./ExpPicture";

export function ExpSectors() {
  return (
    <section className="exp-sectors" aria-labelledby="exp-sectors-title">
      <header className="exp-head">
        <h2 id="exp-sectors-title" className="exp-h2">
          {expSectors.title}
        </h2>
        <p className="exp-lead">{expSectors.lead}</p>
      </header>

      <ul className="exp-sectors__grid">
        {expSectors.items.map((item) => (
          <li key={item.id} className="exp-sector">
            <ExpPicture
              id={item.image}
              alt={item.alt}
              scene={item.id}
              sizes="(max-width: 700px) 92vw, 46vw"
            />
            <div className="exp-sector__body">
              <h3 className="exp-h3">{item.title}</h3>
              <p className="exp-sector__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="exp-banner">
        <ExpIcon name="nodes" className="exp-banner__icon" />
        <div className="exp-banner__copy">
          <p className="exp-banner__title">{expSectors.banner.title}</p>
          <p className="exp-banner__text">{expSectors.banner.text}</p>
        </div>
        <Link href={expSectors.banner.cta.href} className="exp-btn exp-btn--yellow">
          {expSectors.banner.cta.label}
          <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
        </Link>
      </div>
    </section>
  );
}
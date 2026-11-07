import Image from "next/image";
import { abtArchives, abtBcp } from "@/content/about-hub";
import { AbtBcpThumb } from "./AbtBcp";
import { AbtLink } from "./AbtHero";
import { AbtIcon } from "./AbtIcon";

export function AbtArchives() {
  const a = abtArchives;
  return (
    <section id="archives" className="abt-archives" aria-labelledby="abt-archives-title">
      <span id="about-implantation" className="abt-alias" aria-hidden="true" />
      <p className="abt-eyebrow abt-eyebrow--dark">{a.eyebrow}</p>
      <h2 id="abt-archives-title" className="abt-h2">
        {a.title}
      </h2>
      <p className="abt-archives__lead">{a.lead}</p>

      <div className="abt-archives__video">
        <div className="abt-archives__thumbcol">
          <a href={abtBcp.watchUrl} target="_blank" rel="noopener noreferrer" className="abt-archives__thumblink" aria-label="Ouvrir la vidéo officielle sur YouTube">
            <AbtBcpThumb />
          </a>
        </div>
        <div className="abt-archives__videocopy">
          <h3 className="abt-h3 abt-h3--light">{a.videoTitle}</h3>
          <p className="abt-archives__videotext">{a.videoText}</p>
          <a href={abtBcp.watchUrl} target="_blank" rel="noopener noreferrer" className="abt-btn abt-btn--yellow">
            {a.videoButton}
            <AbtIcon name="arrowUpRight" className="abt-btn__icon" />
          </a>
          <p className="abt-archives__videosource">{a.videoSource}</p>
        </div>
      </div>

      <h2 className="abt-h2 abt-h2--md abt-archives__moments-title">{a.momentsTitle}</h2>
      <ul className="abt-moments">
        {a.moments.map((moment) => (
          <li key={moment.id} className={`abt-moment abt-moment--${moment.id}`}>
            <div className="abt-moment__pic">
              <span className="abt-moment__badge">{a.badge}</span>
              <Image
                src={moment.image.src}
                alt={moment.alt}
                width={moment.image.width}
                height={moment.image.height}
                sizes="(max-width: 700px) 100vw, 45vw"
                className="abt-moment__img"
              />
            </div>
            <p className="abt-moment__caption">{moment.caption}</p>
          </li>
        ))}
      </ul>

      <div className="abt-archives__footer">
        <div>
          <p className="abt-archives__footer-title">{a.footer.title}</p>
          <p className="abt-archives__footer-text">{a.footer.text}</p>
        </div>
        <AbtLink href={a.footer.cta.href}>{a.footer.cta.label}</AbtLink>
      </div>
    </section>
  );
}
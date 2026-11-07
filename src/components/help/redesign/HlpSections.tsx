import Link from "next/link";
import { hlpBand, hlpMedia } from "@/content/help-hub";
import { HlpIcon } from "./HlpIcon";

export function HlpMedia() {
  return (
    <section className="hlp-media" aria-labelledby="hlp-media-title">
      <h2 id="hlp-media-title" className="hlp-h2 hlp-h2--sm">
        {hlpMedia.title}
      </h2>
      <p className="hlp-media__lead">{hlpMedia.lead}</p>
      <div className="hlp-media__grid">
        <div className="hlp-media__tile" role="img" aria-label={hlpMedia.tileAria}>
          <span className="hlp-media__badge">{hlpMedia.badge}</span>
          <HlpIcon name="file" className="hlp-media__file" />
          <span className="hlp-media__label">{hlpMedia.tileLabel}</span>
        </div>
        <div className="hlp-media__copy">
          <h3 className="hlp-media__heading">{hlpMedia.heading}</h3>
          <p className="hlp-media__text">{hlpMedia.text}</p>
          <p className="hlp-media__note">{hlpMedia.note}</p>
        </div>
      </div>
    </section>
  );
}

export function HlpBand() {
  return (
    <section className="hlp-cta" aria-labelledby="hlp-cta-title">
      <span className="hlp-circle hlp-circle--dark">
        <HlpIcon name="chat" />
      </span>
      <div className="hlp-cta__copy">
        <h2 id="hlp-cta-title" className="hlp-cta__title">
          {hlpBand.title}
        </h2>
        <p className="hlp-cta__lead">{hlpBand.lead}</p>
      </div>
      <div className="hlp-cta__actions">
        <Link href={hlpBand.primary.href} className="hlp-btn hlp-btn--yellow">
          {hlpBand.primary.label}
          <HlpIcon name="arrowUpRight" className="hlp-btn__icon" />
        </Link>
        <a href={hlpBand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hlp-btn hlp-btn--outline">
          <HlpIcon name="whatsapp" className="hlp-btn__icon" />
          {hlpBand.whatsapp.label}
        </a>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { abtBcp, abtCollab, abtIds } from "@/content/about-hub";
import { AbtLink } from "./AbtHero";
import { AbtIcon } from "./AbtIcon";

/** Miniature officielle YouTube de la vidéo Banque Populaire du Maroc. */
export function AbtBcpThumb() {
  return (
    <span className="abt-bcp-thumb">
      <img
        src={abtCollab.thumbnail.src}
        alt=""
        width={abtCollab.thumbnail.width}
        height={abtCollab.thumbnail.height}
        className="abt-bcp-thumb__img"
      />
      <span className="abt-bcp-thumb__play">
        <AbtIcon name="play" className="abt-bcp-thumb__play-icon" />
      </span>
    </span>
  );
}

/** Vidéo BCP : intégration YouTube « lite » (youtube-nocookie), chargée au clic. */
export function AbtBcp() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section id={abtIds.collaboration} className="abt-bcp" aria-labelledby="abt-bcp-title">
      <p className="abt-eyebrow abt-bcp__eyebrow">{abtCollab.eyebrow}</p>
      <div className="abt-bcp__grid">
        <div className="abt-bcp__media">
          <div className="abt-bcp__frame">
            {loaded ? (
              <iframe
                className="abt-bcp__iframe"
                src={abtBcp.embedUrl}
                title={abtCollab.iframeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button type="button" className="abt-bcp__load" onClick={() => setLoaded(true)} aria-label={abtCollab.playLabel}>
                <AbtBcpThumb />
              </button>
            )}
          </div>
          <p className="abt-bcp__source">{abtCollab.source}</p>
        </div>
        <div className="abt-bcp__copy">
          <h2 id="abt-bcp-title" className="abt-h3">
            {abtCollab.title}
          </h2>
          <p className="abt-bcp__text">{abtCollab.text}</p>
          <AbtLink href={abtBcp.watchUrl}>{abtCollab.link}</AbtLink>
        </div>
      </div>
    </section>
  );
}
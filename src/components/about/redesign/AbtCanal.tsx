"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { abtCanal, abtCanalVideoSrc, abtImages } from "@/content/about-hub";
import { AbtIcon } from "./AbtIcon";

/** Reportage Canal : <video> natif, chargé à la demande (preload="none"). */
export function AbtCanal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    const video = videoRef.current;
    if (video) void video.play().catch(() => undefined);
  }

  return (
    <section id="reportage-canal" className="abt-canal" aria-labelledby="abt-canal-title">
      <div className="abt-canal__inner">
        <p className="abt-eyebrow abt-eyebrow--line abt-eyebrow--light">{abtCanal.eyebrow}</p>
        <h2 id="abt-canal-title" className="abt-h2 abt-h2--light">
          {abtCanal.title}
        </h2>
        <p className="abt-canal__lead">{abtCanal.lead}</p>
        <div className="abt-canal__frame">
          <video
            ref={videoRef}
            className="abt-canal__video"
            controls
            preload="none"
            playsInline
            poster={abtImages.reportagePoster.src}
            aria-label={abtCanal.videoLabel}
            onPlay={() => setStarted(true)}
          >
            <source src={abtCanalVideoSrc} type="video/mp4" />
          </video>
          {started ? null : (
            <>
              <button type="button" className="abt-canal__cover" onClick={play} aria-label="Lancer la lecture du reportage Canal">
                <Image
                  src={abtImages.reportagePoster.src}
                  alt={abtCanal.posterAlt}
                  width={abtImages.reportagePoster.width}
                  height={abtImages.reportagePoster.height}
                  sizes="(max-width: 900px) 100vw, 90vw"
                  className="abt-canal__poster"
                />
                <span className="abt-canal__play">
                  <AbtIcon name="play" className="abt-canal__play-icon" />
                </span>
              </button>
              <span className="abt-canal__badge">{abtCanal.badge}</span>
              <span className="abt-canal__duration">{abtCanal.duration}</span>
            </>
          )}
        </div>
        <div className="abt-canal__actions">
          <button type="button" className="abt-btn abt-btn--yellow" onClick={play}>
            {abtCanal.button}
            <AbtIcon name="play" className="abt-btn__icon abt-btn__icon--play" />
          </button>
          <span className="abt-canal__note">{abtCanal.note}</span>
        </div>
      </div>
    </section>
  );
}
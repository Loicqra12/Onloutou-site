"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { homeFleetCapabilities, homeFleetIntro, homeFleetScene, type FleetCapability } from "@/content/home";

export function FleetPreviewSection() {
  const rootRef = useRef<HTMLElement>(null);
  const burstTimer = useRef<number | null>(null);
  const [active, setActive] = useState<FleetCapability["id"]>("localiser");
  const [burst, setBurst] = useState(false);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  useEffect(() => {
    return () => {
      if (burstTimer.current !== null) window.clearTimeout(burstTimer.current);
    };
  }, []);

  const select = (id: FleetCapability["id"]) => {
    setActive(id);
    setBurst(true);
    if (burstTimer.current !== null) window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBurst(false), 650);
  };

  return (
    <section
      id="flotte"
      data-section="fleet"
      ref={rootRef}
      className={`home-fleet section-spacing motion-reveal is-fleet-${active}${burst ? " is-burst" : ""}`}
      aria-labelledby="home-fleet-title"
    >
      <div className="home-fleet-wrap">
        <div className="home-fleet-copy">
          <p className="home-fleet-eyebrow">
            <span className="home-fleet-eyebrow-line" aria-hidden />
            {homeFleetIntro.eyebrow}
          </p>
          <h2 id="home-fleet-title" className="home-fleet-heading">
            {homeFleetIntro.titleLead}{" "}
            <span>{homeFleetIntro.titleRest}</span>
          </h2>
          <p className="home-fleet-lead">{homeFleetIntro.lead}</p>
          <p className="home-fleet-note">{homeFleetIntro.note}</p>
          <div className="home-fleet-caps" role="group" aria-label="Capacités de géolocalisation et de supervision">
            {homeFleetCapabilities.map((item) => (
              <button
                key={item.id}
                type="button"
                className="home-fleet-cap"
                aria-pressed={active === item.id}
                onClick={() => select(item.id)}
              >
                <span className="home-fleet-cap-number">{item.number}</span>
                <span>
                  <span className="home-fleet-cap-title">{item.title}</span>
                  <span className="home-fleet-cap-text">{item.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="home-fleet-stage">
          <div className="home-fleet-glow" aria-hidden />
          <svg className="home-fleet-deco" viewBox="0 0 640 460" aria-hidden="true">
            <path className="home-fleet-grid-line" d="M40 80 H600 M40 160 H600 M40 240 H600 M40 320 H600 M120 40 V400 M240 40 V400 M360 40 V400 M480 40 V400" />
            <path className="home-fleet-route" pathLength="1" d="M70 330 C 150 300, 190 250, 250 236 S 390 180, 560 128" />
            <path className="home-fleet-route-bit" pathLength="1" d="M250 236 C 310 214, 360 196, 430 168" />
            <circle className="home-fleet-node" cx="150" cy="292" r="3.5" />
            <circle className="home-fleet-node" cx="470" cy="156" r="3.5" />
            <g className="home-fleet-marker">
              <circle className="home-fleet-halo" r="11" />
              <circle className="home-fleet-point" r="6" />
            </g>
          </svg>

          <article className="home-fleet-window home-fleet-window--map">
            <header className="home-fleet-chrome">
              <span className="home-fleet-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span>{homeFleetScene.primary.label}</span>
            </header>
            <Image
              src={homeFleetScene.primary.src}
              alt={homeFleetScene.primary.alt}
              width={homeFleetScene.primary.width}
              height={homeFleetScene.primary.height}
              sizes={homeFleetScene.primary.sizes}
              className="home-fleet-shot"
            />
          </article>

          <article className="home-fleet-window home-fleet-window--board">
            <header className="home-fleet-chrome">
              <span className="home-fleet-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span>{homeFleetScene.secondary.label}</span>
            </header>
            <Image
              src={homeFleetScene.secondary.src}
              alt={homeFleetScene.secondary.alt}
              width={homeFleetScene.secondary.width}
              height={homeFleetScene.secondary.height}
              sizes={homeFleetScene.secondary.sizes}
              className="home-fleet-shot"
            />
          </article>

          <div className="home-fleet-alert">
            <span className="home-fleet-alert-icon" aria-hidden>
              !
            </span>
            <span>
              <strong>{homeFleetIntro.alert.title}</strong>
              <span>{homeFleetIntro.alert.detail}</span>
            </span>
          </div>
        </div>

        <p className="home-fleet-disclaimer">
          <span className="home-fleet-info" aria-hidden>
            i
          </span>
          {homeFleetIntro.disclaimer}
        </p>

        <div className="home-fleet-cta">
          <Link href={homeFleetIntro.cta.href} className="home-fleet-link">
            {homeFleetIntro.cta.label}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

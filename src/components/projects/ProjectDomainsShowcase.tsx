"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { projectImage } from "@/components/projects/projectMedia";
import { projectsDomains, projectsImageDisclaimer } from "@/content/projects-page";

const AUTOPLAY_MS = 7000;
const RESUME_MS = 10000;

/** Ancres d'URL (/projets#…) qui ouvrent directement le domaine correspondant. */
const DOMAIN_HASHES: Record<string, string> = {
  plateformes: "platforms",
  supervision: "fleet",
  mobilite: "mobility",
};

function domainLinks(domain: (typeof projectsDomains.items)[number]) {
  if ("links" in domain && domain.links) return domain.links;
  return [domain.link];
}

export function ProjectDomainsShowcase() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const items = projectsDomains.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);

  const timers = useRef<{ advance: number | null; resume: number | null }>({ advance: null, resume: null });
  const flags = useRef({
    desktop: false,
    reduced: false,
    hidden: false,
    inView: false,
    hover: false,
    focus: false,
    interaction: false,
    userPaused: false,
  });

  const clearTimers = useCallback(() => {
    if (timers.current.advance !== null) window.clearTimeout(timers.current.advance);
    if (timers.current.resume !== null) window.clearTimeout(timers.current.resume);
    timers.current = { advance: null, resume: null };
  }, []);

  const canAutoplay = useCallback(() => {
    const f = flags.current;
    return (
      f.desktop &&
      !f.reduced &&
      !f.userPaused &&
      !f.interaction &&
      !f.hover &&
      !f.focus &&
      !f.hidden &&
      f.inView
    );
  }, []);

  const scheduleAdvance = useCallback(() => {
    clearTimers();
    if (!canAutoplay()) return;
    timers.current.advance = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
  }, [canAutoplay, clearTimers, items.length]);

  useEffect(() => {
    rootRef.current?.classList.add("proj-domains--enhanced");
  }, []);

  useEffect(() => {
    scheduleAdvance();
    return clearTimers;
  }, [activeIndex, scheduleAdvance, clearTimers]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      flags.current.desktop = desktopQuery.matches;
      flags.current.reduced = reducedQuery.matches;
      setShowPlayback(desktopQuery.matches && !reducedQuery.matches);
      scheduleAdvance();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        flags.current.inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        scheduleAdvance();
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(root);

    const onVisibility = () => {
      flags.current.hidden = document.visibilityState === "hidden";
      scheduleAdvance();
    };

    desktopQuery.addEventListener("change", sync);
    reducedQuery.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      io.disconnect();
      desktopQuery.removeEventListener("change", sync);
      reducedQuery.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimers();
    };
  }, [scheduleAdvance, clearTimers]);

  const selectIndex = useCallback(
    (index: number, manual = false) => {
      setActiveIndex(index);
      if (manual) {
        flags.current.interaction = true;
        clearTimers();
        timers.current.resume = window.setTimeout(() => {
          flags.current.interaction = false;
          scheduleAdvance();
        }, RESUME_MS);
      }
    },
    [clearTimers, scheduleAdvance],
  );

  // Ouvre le domaine désigné par l'ancre (chargement, hashchange ou lien interne à la page).
  useEffect(() => {
    const sync = () => {
      const domainId = DOMAIN_HASHES[window.location.hash.slice(1)];
      const index = items.findIndex((item) => item.id === domainId);
      if (index < 0) return;
      selectIndex(index, true);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rootRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (link) window.setTimeout(sync, 80);
    };
    sync();
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", onClick);
    };
  }, [items, selectIndex]);

  const togglePause = () => {
    flags.current.userPaused = !flags.current.userPaused;
    setUserPaused(flags.current.userPaused);
    scheduleAdvance();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectIndex((activeIndex + 1) % items.length, true);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectIndex((activeIndex - 1 + items.length) % items.length, true);
    }
  };

  return (
    <section
      id={projectsDomains.id}
      className="proj-domains section-spacing scroll-mt-20 bg-brand-paper"
      aria-labelledby="proj-domains-title"
      ref={rootRef}
      onMouseEnter={() => {
        flags.current.hover = true;
        scheduleAdvance();
      }}
      onMouseLeave={() => {
        flags.current.hover = false;
        scheduleAdvance();
      }}
      onFocusCapture={() => {
        flags.current.focus = true;
        scheduleAdvance();
      }}
      onBlurCapture={() => {
        flags.current.focus = false;
        scheduleAdvance();
      }}
    >
      <div className="container-content">
        <Reveal>
          <div className="proj-domains__head">
            <h2 id="proj-domains-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {projectsDomains.title}
            </h2>
            {showPlayback ? (
              <button
                type="button"
                className="proj-domains__playback"
                aria-pressed={userPaused}
                aria-label={userPaused ? "Reprendre le défilement des domaines" : "Mettre en pause le défilelement des domaines"}
                onClick={togglePause}
              >
                {userPaused ? "Lecture" : "Pause"}
              </button>
            ) : null}
          </div>
          <p className="proj-domains__disclaimer">{projectsImageDisclaimer}</p>
        </Reveal>

        <div className="proj-domains__showcase">
          <div
            role="tablist"
            aria-label="Domaines de projets"
            className="proj-domains__nav"
            onKeyDown={onKeyDown}
          >
            {items.map((domain, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={domain.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${domain.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${domain.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`proj-domains__nav-btn${selected ? " proj-domains__nav-btn--active" : ""}`}
                  onClick={() => selectIndex(index, true)}
                >
                  <span className="proj-domains__nav-num">{domain.number}</span>
                  {domain.title}
                </button>
              );
            })}
          </div>

          <div className="proj-domains__stage">
            {items.map((domain, index) => {
              const selected = index === activeIndex;
              const media = projectImage(domain.mediaKey);
              const links = domainLinks(domain);

              return (
                <article
                  key={domain.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${domain.id}`}
                  aria-labelledby={`${baseId}-tab-${domain.id}`}
                  className={`proj-domains__panel${selected ? " proj-domains__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <div className="proj-domains__panel-copy">
                    <p className="proj-domains__panel-num">{domain.number}</p>
                    <h3>{domain.title}</h3>
                    <ul className="proj-domains__topics">
                      {domain.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                    <div className="proj-domains__links">
                      {links.map((link) => (
                        <Link key={link.href} href={link.href} className="proj-domains__link link-motion">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <figure className="proj-domains__figure">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="proj-domains__img"
                      style={{ objectPosition: media.objectPosition }}
                    />
                    <figcaption>{projectsImageDisclaimer}</figcaption>
                  </figure>
                </article>
              );
            })}
          </div>

          <div className="proj-domains__stack">
            {items.map((domain) => {
              const media = projectImage(domain.mediaKey);
              const links = domainLinks(domain);
              return (
                <article key={domain.id} className="proj-domains__stack-item">
                  <header>
                    <span className="proj-domains__panel-num">{domain.number}</span>
                    <h3>{domain.title}</h3>
                  </header>
                  <figure className="proj-domains__figure">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="100vw"
                      className="proj-domains__img"
                    />
                    <figcaption>{projectsImageDisclaimer}</figcaption>
                  </figure>
                  <ul className="proj-domains__topics">
                    {domain.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <div className="proj-domains__links">
                    {links.map((link) => (
                      <Link key={link.href} href={link.href}>{link.label}</Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

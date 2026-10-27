"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { projectShowcaseIntro, projectShowcaseItems } from "@/content/home";

const AUTOPLAY_MS = 6000;
const RESUME_MS = 8000;

type ProjectId = (typeof projectShowcaseItems)[number]["id"];

export function HomeProjectsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const pointerSelectRef = useRef(false);
  const desktopRef = useRef(false);
  const reducedRef = useRef(false);
  const hiddenRef = useRef(false);
  const inViewRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const focusPausedRef = useRef(false);
  const userPausedRef = useRef(false);
  const interactionPausedRef = useRef(false);
  const [activeId, setActiveId] = useState<ProjectId>(projectShowcaseItems[0].id);
  const [userPaused, setUserPaused] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const clearAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  const clearResume = useCallback(() => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const canPlay = useCallback(
    () =>
      desktopRef.current &&
      !reducedRef.current &&
      !userPausedRef.current &&
      !interactionPausedRef.current &&
      !hoverPausedRef.current &&
      !focusPausedRef.current &&
      !hiddenRef.current &&
      inViewRef.current,
    [],
  );

  const stopProgress = useCallback(() => {
    clearAdvance();
    rootRef.current?.classList.remove("is-show-playing");
  }, [clearAdvance]);

  const startCycle = useCallback(() => {
    clearAdvance();
    const root = rootRef.current;
    if (!root) return;
    root.classList.remove("is-show-playing");
    if (!canPlay()) return;
    void root.offsetWidth;
    root.classList.add("is-show-playing");
    advanceTimer.current = window.setTimeout(() => {
      setActiveId((current) => {
        const index = projectShowcaseItems.findIndex((item) => item.id === current);
        return projectShowcaseItems[(index + 1) % projectShowcaseItems.length].id;
      });
    }, AUTOPLAY_MS);
  }, [canPlay, clearAdvance]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  useEffect(() => {
    startCycle();
    return () => clearAdvance();
  }, [activeId, startCycle, clearAdvance]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia("(min-width: 1100px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnvironment = () => {
      desktopRef.current = desktopQuery.matches;
      reducedRef.current = reducedQuery.matches;
      setShowPlayback(desktopQuery.matches && !reducedQuery.matches);
      if (!desktopQuery.matches || reducedQuery.matches) stopProgress();
      else startCycle();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (visible === inViewRef.current) return;
        inViewRef.current = visible;
        if (visible) startCycle();
        else stopProgress();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );

    const onVisibility = () => {
      hiddenRef.current = document.hidden;
      if (document.hidden) {
        stopProgress();
        return;
      }
      if (userPausedRef.current) return;
      startCycle();
    };

    syncEnvironment();
    observer.observe(root);
    desktopQuery.addEventListener("change", syncEnvironment);
    reducedQuery.addEventListener("change", syncEnvironment);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      desktopQuery.removeEventListener("change", syncEnvironment);
      reducedQuery.removeEventListener("change", syncEnvironment);
      document.removeEventListener("visibilitychange", onVisibility);
      clearAdvance();
      clearResume();
    };
  }, [clearAdvance, clearResume, startCycle, stopProgress]);

  const select = (id: ProjectId, manual = false) => {
    setActiveId(id);
    if (!manual) return;
    interactionPausedRef.current = true;
    clearResume();
    stopProgress();
    resumeTimer.current = window.setTimeout(() => {
      interactionPausedRef.current = false;
      startCycle();
    }, RESUME_MS);
  };

  const togglePlayback = () => {
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    setUserPaused(next);
    clearResume();
    interactionPausedRef.current = false;
    if (next) stopProgress();
    else startCycle();
  };

  const onPointerEnter = () => {
    if (!desktopRef.current) return;
    hoverPausedRef.current = true;
    stopProgress();
  };

  const onPointerLeave = () => {
    hoverPausedRef.current = false;
    if (!interactionPausedRef.current) startCycle();
  };

  const onPointerDownCapture = () => {
    pointerSelectRef.current = true;
  };

  const onFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!listRef.current?.contains(event.target as Node)) return;
    if (pointerSelectRef.current) {
      pointerSelectRef.current = false;
      return;
    }
    focusPausedRef.current = true;
    stopProgress();
  };

  const onBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (listRef.current?.contains(next)) return;
    focusPausedRef.current = false;
    if (!interactionPausedRef.current && !hoverPausedRef.current) startCycle();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-project-id]") ?? [])];
    const current = buttons.findIndex((button) => button === document.activeElement);
    if (current < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
    }
    if (event.key === "ArrowRight") buttons[Math.min(current + 1, buttons.length - 1)]?.focus();
    if (event.key === "ArrowLeft") buttons[Math.max(current - 1, 0)]?.focus();
    if (event.key === "Home") buttons[0]?.focus();
    if (event.key === "End") buttons[buttons.length - 1]?.focus();
  };

  const scrollMobileTo = (index: number) => {
    const next = Math.max(0, Math.min(projectShowcaseItems.length - 1, index));
    setMobileIndex(next);
    const card = trackRef.current?.querySelector<HTMLElement>(`[data-mobile-index="${next}"]`);
    card?.scrollIntoView({ inline: "start", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const onMobileScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-mobile-index]")];
    const nearest = cards.reduce(
      (best, card) => {
        const distance = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
        return distance < best.distance ? { index: Number(card.dataset.mobileIndex), distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setMobileIndex(nearest.index);
  };

  return (
    <section
      id="projets"
      ref={rootRef}
      data-section="projects"
      data-active={activeId}
      className="home-show"
      aria-labelledby="home-show-title"
      style={{ "--show-duration": `${AUTOPLAY_MS}ms` } as CSSProperties}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="container-content home-show-head">
        <div>
          <p className="home-show-eyebrow">
            <span aria-hidden />
            {projectShowcaseIntro.eyebrow}
          </p>
          <h2 id="home-show-title" className="home-show-heading">
            {projectShowcaseIntro.title}
          </h2>
          <p className="home-show-lead">{projectShowcaseIntro.lead}</p>
        </div>
        {showPlayback ? (
          <button
            type="button"
            className="home-show-playback"
            aria-pressed={userPaused}
            aria-label={userPaused ? "Reprendre le défilement des projets" : "Mettre en pause le défilement des projets"}
            onClick={togglePlayback}
          >
            <span aria-hidden>{userPaused ? "▶" : "❚❚"}</span>
            {userPaused ? "Lecture" : "Pause"}
          </button>
        ) : null}
      </div>

      <div
        ref={listRef}
        className="home-show-desktop"
        onPointerDownCapture={onPointerDownCapture}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
        onKeyDown={onKeyDown}
      >
        {projectShowcaseItems.map((item) => {
          const active = item.id === activeId;
          return (
            <article key={item.id} className={`home-show-panel${active ? " is-active" : ""}`}>
              <button
                type="button"
                className="home-show-hit"
                data-project-id={item.id}
                aria-pressed={active}
                aria-label={`${item.index}. ${item.title}`}
                onClick={() => select(item.id, true)}
                onFocus={() => {
                  if (pointerSelectRef.current) return;
                  select(item.id, true);
                }}
              />
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes={active ? "(min-width: 1100px) 58vw, 100vw" : "(min-width: 1100px) 12vw, 100vw"}
                className="home-show-photo"
                style={{ objectPosition: item.objectPosition }}
              />
              <div className="home-show-veil" aria-hidden />
              <div className="home-show-copy">
                <p className="home-show-index">{item.index}</p>
                <h3 className="home-show-title">{active ? item.title : item.shortTitle}</h3>
                <p className="home-show-text">{item.description}</p>
                {"note" in item && item.note ? <p className="home-show-note">{item.note}</p> : null}
                {"href" in item && item.href && "cta" in item && item.cta ? (
                  <Link href={item.href} className="home-show-link">
                    {item.cta} <span aria-hidden>→</span>
                  </Link>
                ) : null}
                <span className="home-show-progress" aria-hidden />
              </div>
            </article>
          );
        })}
      </div>

      <div className="home-show-mobile">
        <div ref={trackRef} className="home-show-track" onScroll={onMobileScroll}>
          {projectShowcaseItems.map((item, index) => (
            <article key={item.id} className="home-show-card" data-mobile-index={index}>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 1099px) 84vw, 70vw"
                className="home-show-card-photo"
                style={{ objectPosition: item.objectPosition }}
              />
              <div className="home-show-card-body">
                <p className="home-show-index">{item.index}</p>
                <h3 className="home-show-title">{item.title}</h3>
                <p className="home-show-text">{item.description}</p>
                {"note" in item && item.note ? <p className="home-show-note">{item.note}</p> : null}
                {"href" in item && item.href && "cta" in item && item.cta ? (
                  <Link href={item.href} className="home-show-link">
                    {item.cta} <span aria-hidden>→</span>
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="home-show-nav">
          <button type="button" className="home-show-nav-btn" onClick={() => scrollMobileTo(mobileIndex - 1)} aria-label="Projet précédent">
            ←
          </button>
          <p className="home-show-count" aria-live="polite">
            {mobileIndex + 1} / {projectShowcaseItems.length}
          </p>
          <button type="button" className="home-show-nav-btn" onClick={() => scrollMobileTo(mobileIndex + 1)} aria-label="Projet suivant">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
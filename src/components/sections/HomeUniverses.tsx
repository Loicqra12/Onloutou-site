"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { homeUniverseIntro, homeUniverses } from "@/content/home";

const UNIVERSE_AUTOPLAY_DURATION = 5500;
const UNIVERSE_RESUME_DELAY = 8000;

export function HomeUniverses() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const userPausedRef = useRef(false);
  const interactionPausedRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const focusPausedRef = useRef(false);
  const inViewRef = useRef(false);
  const hiddenRef = useRef(false);
  const reducedRef = useRef(false);
  const desktopRef = useRef(false);
  const resumeOverrideRef = useRef(false);
  const pointerFocusRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);

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
      !(hoverPausedRef.current && !resumeOverrideRef.current) &&
      !focusPausedRef.current &&
      !hiddenRef.current &&
      inViewRef.current,
    [],
  );

  const stopProgress = useCallback(() => {
    clearAdvance();
    rootRef.current?.classList.remove("is-universe-playing");
  }, [clearAdvance]);

  const startCycle = useCallback(() => {
    clearAdvance();
    const root = rootRef.current;
    if (!root) return;
    root.classList.remove("is-universe-playing");
    if (!canPlay()) return;
    void root.offsetWidth;
    root.classList.add("is-universe-playing");
    advanceTimer.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % homeUniverses.length);
    }, UNIVERSE_AUTOPLAY_DURATION);
  }, [canPlay, clearAdvance]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    startCycle();
    return () => clearAdvance();
  }, [activeIndex, startCycle, clearAdvance]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
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
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        if (visible === inViewRef.current) return;
        inViewRef.current = visible;
        if (visible) startCycle();
        else stopProgress();
      },
      { threshold: [0, 0.4, 0.5, 1] },
    );

    const onVisibility = () => {
      hiddenRef.current = document.hidden;
      if (document.hidden) {
        stopProgress();
        return;
      }
      if (userPausedRef.current) return;
      interactionPausedRef.current = false;
      clearResume();
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

  const selectFromUser = (index: number) => {
    interactionPausedRef.current = true;
    clearResume();
    stopProgress();
    activeIndexRef.current = index;
    setActiveIndex(index);
    resumeTimer.current = window.setTimeout(() => {
      interactionPausedRef.current = false;
      startCycle();
    }, UNIVERSE_RESUME_DELAY);
  };

  const togglePlayback = () => {
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    setUserPaused(next);
    clearResume();
    interactionPausedRef.current = false;
    if (next) {
      resumeOverrideRef.current = false;
      stopProgress();
      return;
    }
    resumeOverrideRef.current = true;
    startCycle();
  };

  const onPointerEnter = () => {
    if (!desktopRef.current || resumeOverrideRef.current) return;
    hoverPausedRef.current = true;
    stopProgress();
  };

  const onPointerLeave = () => {
    hoverPausedRef.current = false;
    resumeOverrideRef.current = false;
    if (!interactionPausedRef.current) startCycle();
  };

  const onPointerDownCapture = () => {
    pointerFocusRef.current = true;
  };

  const onFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!listRef.current?.contains(event.target as Node)) return;
    if (pointerFocusRef.current) {
      pointerFocusRef.current = false;
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
    const summaries = [...(listRef.current?.querySelectorAll("summary") ?? [])];
    const current = summaries.indexOf(document.activeElement as HTMLElement);
    if (current < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
    }
    if (event.key === "ArrowDown") summaries[Math.min(current + 1, summaries.length - 1)]?.focus();
    if (event.key === "ArrowUp") summaries[Math.max(current - 1, 0)]?.focus();
    if (event.key === "Home") summaries[0]?.focus();
    if (event.key === "End") summaries[summaries.length - 1]?.focus();
  };

  return (
    <section
      id="univers"
      data-section="solutions"
      ref={rootRef}
      className="home-universes-section bg-[#090909] text-white"
      aria-labelledby="home-universes-title"
      style={{ "--universe-duration": `${UNIVERSE_AUTOPLAY_DURATION}ms` } as CSSProperties}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="container-content py-16 sm:py-20 lg:py-24">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#F5C400]">
            <span className="h-px w-8 bg-[#F5C400]" aria-hidden />
            {homeUniverseIntro.eyebrow}
          </p>
          {showPlayback ? (
            <button
              type="button"
              className="home-universe-playback"
              aria-pressed={userPaused}
              aria-label={userPaused ? "Reprendre le défilement des univers" : "Mettre en pause le défilement des univers"}
              onClick={togglePlayback}
            >
              <span aria-hidden>{userPaused ? "▶" : "❚❚"}</span>
              {userPaused ? "Reprendre l’animation" : "Mettre en pause"}
            </button>
          ) : null}
        </div>
        <h2
          id="home-universes-title"
          className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
        >
          {homeUniverseIntro.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{homeUniverseIntro.lead}</p>

        <div
          ref={listRef}
          className="home-universes"
          onKeyDown={onKeyDown}
          onPointerDownCapture={onPointerDownCapture}
          onFocusCapture={onFocusCapture}
          onBlurCapture={onBlurCapture}
        >
          {homeUniverses.map((universe, index) => (
            <details key={universe.id} className="home-universe" name="home-universe" open={index === activeIndex}>
              <summary
                className="home-universe-summary"
                aria-controls={`universe-panel-${universe.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  selectFromUser(index);
                }}
              >
                <span className="home-universe-number">{universe.number}</span>
                <span className="home-universe-title">{universe.title}</span>
                <span className="home-universe-mark" aria-hidden />
                <span className="home-universe-progress" aria-hidden />
              </summary>
              <div className="home-universe-panel" id={`universe-panel-${universe.id}`}>
                <p>{universe.description}</p>
                <Link href={universe.href} className="home-universe-link">
                  Découvrir cet univers <span className="home-universe-arrow" aria-hidden>→</span>
                </Link>
                <figure className={`home-universe-media home-universe-media--${universe.media.type}`}>
                  <Image
                    src={universe.media.src}
                    alt={universe.media.alt}
                    width={universe.media.width}
                    height={universe.media.height}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="home-universe-image"
                    style={{ objectPosition: universe.media.objectPosition }}
                  />
                  {"disclaimer" in universe.media && universe.media.disclaimer ? (
                    <figcaption>{universe.media.disclaimer}</figcaption>
                  ) : null}
                </figure>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { hlpBrowse, hlpHero, hlpResults, hlpTopicsIntro, type HlpItem, type HlpTopic } from "@/content/help-hub";
import { HlpIcon } from "./HlpIcon";

/* ---- Synchronisation avec le hash de l’URL (store externe) ---- */
const listeners = new Set<() => void>();
function subscribeHash(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("hashchange", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("hashchange", callback);
  };
}
const getHash = () => decodeURIComponent(window.location.hash.replace(/^#/, ""));
const getServerHash = () => "";
function writeHash(hash: string) {
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${hash}`);
  listeners.forEach((callback) => callback());
}

function normalise(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Props = { topics: HlpTopic[]; defaultTopicId: string };

export function HlpCenter({ topics, defaultTopicId }: Props) {
  const uid = useId();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const [query, setQuery] = useState("");
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const internal = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const byTopic = topics.find((topic) => topic.id === hash);
  const byItem = topics.find((topic) => topic.items.some((item) => item.id === hash));
  const topic = byTopic ?? byItem ?? topics.find((t) => t.id === defaultTopicId) ?? topics[0];
  const derivedOpen = byItem ? hash : (topic.items[0]?.id ?? null);
  const openId = closedAt === hash ? null : derivedOpen;

  /* Défilement vers la cible d’un hash externe (arrivée sur la page ou changement manuel). */
  useEffect(() => {
    if (!hash || internal.current === hash) return;
    internal.current = hash;
    const target = document.getElementById(hash) ?? panelRef.current;
    target?.scrollIntoView({ block: "start" });
  }, [hash, topic.id]);

  const go = (nextHash: string, scroll: boolean) => {
    internal.current = nextHash;
    setClosedAt(null);
    writeHash(nextHash);
    if (scroll) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const toggle = (item: HlpItem) => {
    if (openId === item.id) {
      internal.current = topic.id;
      setClosedAt(topic.id);
      writeHash(topic.id);
    } else {
      go(item.id, false);
    }
  };

  const tokens = normalise(query).split(/\s+/).filter(Boolean);
  const results =
    tokens.length === 0
      ? []
      : topics.flatMap((t) =>
          t.items
            .filter((item) => {
              const haystack = normalise(`${item.question} ${item.answer} ${t.title}`);
              return tokens.every((token) => haystack.includes(token));
            })
            .map((item) => ({ item, topic: t })),
        );

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tokens.length) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="hlp-top" aria-labelledby="hlp-title">
        <div className="hlp-top__copy">
          <p className="hlp-eyebrow">{hlpHero.eyebrow}</p>
          <h1 id="hlp-title" className="hlp-h1">
            {hlpHero.titleLines.map((line) => (
              <span key={line} className="hlp-h1__line">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="hlp-top__lead">{hlpHero.lead}</p>
          <form className="hlp-find" role="search" onSubmit={onSearch}>
            <label htmlFor={`${uid}-q`} className="hlp-sr">
              {hlpHero.searchLabel}
            </label>
            <HlpIcon name="search" className="hlp-find__icon" />
            <input
              id={`${uid}-q`}
              className="hlp-find__input"
              type="search"
              autoComplete="off"
              placeholder={hlpHero.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="hlp-find__button">
              {hlpHero.searchButton}
            </button>
          </form>
          <ul className="hlp-chips" aria-label="Recherches fréquentes">
            {hlpHero.chips.map((chip) => (
              <li key={chip}>
                <button type="button" className="hlp-chip" onClick={() => setQuery(chip)}>
                  {chip}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Image
          src={hlpHero.image.src}
          alt=""
          width={hlpHero.image.width}
          height={hlpHero.image.height}
          sizes="(max-width: 900px) 60vw, 38vw"
          className="hlp-top__img"
          priority
          aria-hidden="true"
        />
      </section>

      {tokens.length > 0 ? (
        <section ref={resultsRef} className="hlp-results" aria-labelledby={`${uid}-results`}>
          <div className="hlp-results__head">
            <h2 id={`${uid}-results`} className="hlp-h2 hlp-h2--sm">
              {hlpResults.title}
            </h2>
            <button type="button" className="hlp-results__clear" onClick={() => setQuery("")}>
              {hlpResults.clear}
            </button>
          </div>
          <p className="hlp-results__live" role="status">
            {results.length === 0 ? hlpResults.empty : `${results.length} résultat${results.length > 1 ? "s" : ""}`}
          </p>
          {results.length === 0 ? (
            <p className="hlp-results__empty">
              {hlpResults.emptyHelp}{" "}
              <Link href={hlpBrowse.contact.href} className="hlp-link">
                {hlpBrowse.contact.label}
              </Link>
            </p>
          ) : (
            <ul className="hlp-results__list">
              {results.map(({ item, topic: t }) => (
                <li key={item.id} className="hlp-result">
                  <p className="hlp-result__topic">{t.title}</p>
                  <h3 className="hlp-result__q">{item.question}</h3>
                  <p className="hlp-result__a">{item.answer}</p>
                  <button
                    type="button"
                    className="hlp-link hlp-link--button"
                    onClick={() => {
                      setQuery("");
                      go(item.id, true);
                    }}
                  >
                    {hlpResults.open}
                    <HlpIcon name="arrowRight" className="hlp-link__icon" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <section className="hlp-topics" aria-labelledby={`${uid}-topics`}>
        <h2 id={`${uid}-topics`} className="hlp-h2">
          {hlpTopicsIntro.title}
        </h2>
        <ul className="hlp-topics__grid">
          {topics.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className={`hlp-topic${t.id === topic.id ? " is-current" : ""}`}
                aria-current={t.id === topic.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  go(t.id, true);
                }}
              >
                <span className="hlp-circle">
                  <HlpIcon name={t.icon} />
                </span>
                <span className="hlp-topic__label">{t.title}</span>
                <HlpIcon name="arrowRight" className="hlp-topic__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section ref={panelRef} id={topic.id} className="hlp-browse" aria-label={hlpBrowse.eyebrow}>
        <nav className="hlp-side" aria-label={hlpBrowse.eyebrow}>
          <p className="hlp-side__title">{hlpBrowse.eyebrow}</p>
          <ul className="hlp-side__list">
            {topics.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`hlp-side__link${t.id === topic.id ? " is-current" : ""}`}
                  aria-current={t.id === topic.id ? "true" : undefined}
                  onClick={() => go(t.id, false)}
                >
                  {t.title}
                  <HlpIcon name="chevronRight" className="hlp-side__chevron" />
                </button>
              </li>
            ))}
          </ul>
          <Link href={hlpBrowse.contact.href} className="hlp-link hlp-side__contact">
            {hlpBrowse.contact.label}
            <HlpIcon name="arrowUpRight" className="hlp-link__icon" />
          </Link>
        </nav>
        <div className="hlp-panel" aria-labelledby={`${uid}-panel`}>
          <h2 id={`${uid}-panel`} className="hlp-h2 hlp-h2--panel">
            {topic.title}
          </h2>
          <ul className="hlp-acc">
            {topic.items.map((item) => {
              const open = openId === item.id;
              return (
                <li key={item.id} id={item.id} className={`hlp-acc__item${open ? " is-open" : ""}`}>
                  <h3 className="hlp-acc__heading">
                    <button
                      type="button"
                      className="hlp-acc__button"
                      aria-expanded={open}
                      aria-controls={`${uid}-${item.id}`}
                      onClick={() => toggle(item)}
                    >
                      <span>{item.question}</span>
                      <HlpIcon name={open ? "minus" : "chevronDown"} className="hlp-acc__icon" />
                    </button>
                  </h3>
                  <div id={`${uid}-${item.id}`} role="region" aria-labelledby={undefined} aria-label={item.question} className="hlp-acc__panel" hidden={!open}>
                    <p>{item.answer}</p>
                    {item.links.length > 0 ? (
                      <ul className="hlp-acc__links">
                        {item.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link href={link.href} className="hlp-link">
                              {link.label}
                              <HlpIcon name="arrowUpRight" className="hlp-link__icon" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
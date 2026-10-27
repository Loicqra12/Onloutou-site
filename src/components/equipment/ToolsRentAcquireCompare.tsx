"use client";

import Link from "next/link";
import { TOOLS_MODE_PREFILL_KEY, toolsRentAcquireCompare } from "@/content/tools-equipment-page";

function goCompare() {
  const mode = "comparer les deux";
  try {
    sessionStorage.setItem(TOOLS_MODE_PREFILL_KEY, mode);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("onloutou-tools-mode", { detail: mode }));
  document.getElementById("demande-materiel")?.scrollIntoView({ behavior: "smooth" });
}

export function ToolsRentAcquireCompare() {
  const data = toolsRentAcquireCompare;

  return (
    <section className="tem-rac section-spacing bg-brand-paper" aria-labelledby="tem-rac-title">
      <div className="container-content">
        <h2 id="tem-rac-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="tem-rac__grid">
          <div className="tem-rac__block">
            <h3>{data.rent.title}</h3>
            <p className="tem-rac__when">Pertinente lorsque :</p>
            <ul>
              {data.rent.when.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <Link href={data.rent.href} className="tem-rac__link link-motion">{data.rent.label}</Link>
          </div>
          <div className="tem-rac__block tem-rac__block--dark">
            <h3>{data.buy.title}</h3>
            <p className="tem-rac__when">Pertinente lorsque :</p>
            <ul>
              {data.buy.when.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <Link href={data.buy.href} className="tem-rac__link link-motion">{data.buy.label}</Link>
          </div>
          <div className="tem-rac__block tem-rac__block--accent">
            <h3>{data.compare.title}</h3>
            <p className="tem-rac__when">Pertinente lorsque :</p>
            <ul>
              {data.compare.when.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <button type="button" className="tem-rac__btn" onClick={goCompare}>{data.compare.cta.label}</button>
            <noscript>
              <Link href={data.compare.cta.href} className="tem-rac__link link-motion">{data.compare.cta.label}</Link>
            </noscript>
          </div>
        </div>
      </div>
    </section>
  );
}

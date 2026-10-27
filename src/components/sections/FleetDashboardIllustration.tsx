"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";

const statusChips = [
  "En ligne",
  "Suivi GPS",
  "Alertes",
  "Position actualisée",
  "Actifs supervisés",
] as const;

const ROUTE_PATH = "M52 54c64 35 88 2 133 36s58 76 111 49 104-85 174-45";

export function FleetDashboardIllustration() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const drawRoute = () => root.classList.add("fleet-route-active");

    let routeObserver: IntersectionObserver | undefined;
    if (prefersReducedMotion()) {
      drawRoute();
    } else {
      routeObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            drawRoute();
            routeObserver?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      routeObserver.observe(root);
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let pointerBound = false;

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setTilt({ x: px * 8, y: py * 6 });
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    const bindPointer = () => {
      if (pointerBound || !finePointer.matches) return;
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      pointerBound = true;
    };

    const unbindPointer = () => {
      if (!pointerBound) return;
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      pointerBound = false;
      onLeave();
    };

    const pointerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) bindPointer();
        else unbindPointer();
      },
      { threshold: 0.05 },
    );
    pointerObserver.observe(root);

    return () => {
      routeObserver?.disconnect();
      pointerObserver.disconnect();
      unbindPointer();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-illustration relative flex min-h-[360px] items-center justify-center sm:min-h-[500px]"
      aria-label="Schéma illustratif d’une interface de supervision — données fictives à titre de démonstration"
      style={
        {
          "--tilt-x": `${tilt.x}px`,
          "--tilt-y": `${tilt.y}px`,
        } as React.CSSProperties
      }
    >
      <p className="sr-only">
        Illustration non connectée à des données opérationnelles en temps réel.
      </p>
      <div
        className="pointer-events-none absolute h-[280px] w-[280px] rounded-full border border-black/10 sm:h-[500px] sm:w-[500px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full border border-black/10 sm:h-[390px] sm:w-[390px]"
        aria-hidden
      />
      <div
        className="fleet-panel-main relative z-[2] w-[95%] max-w-[480px] -rotate-1 rounded-[18px] bg-brand-white p-4 shadow-[0_30px_80px_rgba(35,28,0,0.14)] sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <small className="block text-[10px] text-brand-muted">Centre de contrôle</small>
            <strong className="font-display text-[17px] font-bold">Vue d’ensemble</strong>
          </div>
          <span className="rounded-md border border-brand-border bg-brand-paper px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-brand-muted">
            Illustration
          </span>
        </div>
        <div className="relative mt-4 h-[190px] overflow-hidden rounded-xl bg-brand-paper sm:h-[250px]">
          <svg viewBox="0 0 520 290" className="h-full w-full" role="img" aria-hidden>
            <path
              d="M21 209C76 157 118 191 161 137S253 91 303 124s87 44 127 1 59-20 77-1"
              fill="none"
              stroke="#323232"
              strokeWidth="2"
              strokeDasharray="5 8"
            />
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="#e9b900"
              strokeWidth="4"
              pathLength={1}
              className="fleet-route"
            />
            <circle cx="52" cy="54" r="8" fill="#f5c400" />
            <circle cx="296" cy="139" r="8" fill="#f5c400" className="gps-pulse-dot" />
            <circle cx="470" cy="94" r="8" fill="#f5c400" className="gps-pulse-dot gps-pulse-dot--delay" />
            <g transform="translate(260 196)" className="fleet-vehicle-once">
              <circle r="20" fill="#151515" />
              <path d="M-9 4h18l-3-8H-5z" fill="#f5c400" />
              <circle cx="-6" cy="7" r="2.5" fill="#fff" />
              <circle cx="6" cy="7" r="2.5" fill="#fff" />
            </g>
          </svg>
          <div className="fleet-chip fleet-chip-1 absolute left-[12%] top-[24%] rounded-md bg-white px-2 py-1.5 text-[9px] font-bold shadow-md">
            <span className="mr-1 inline-block h-1 w-1 rounded-full bg-brand-yellow" />
            Suivi GPS
          </div>
          <div className="fleet-chip fleet-chip-2 absolute right-[10%] top-[55%] rounded-md bg-white px-2 py-1.5 text-[9px] font-bold shadow-md">
            <span className="mr-1 inline-block h-1 w-1 rounded-full bg-brand-yellow" />
            En ligne
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {statusChips.map((label, index) => (
            <span
              key={label}
              className={`fleet-status-chip rounded-md border border-[#eeeeee] bg-brand-paper px-2.5 py-1.5 text-[10px] font-semibold text-brand-ink`}
              style={{ "--chip-i": index } as React.CSSProperties}
            >
              {label}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[9px] leading-snug text-brand-muted">
          Interface de démonstration — sans indicateurs chiffrés ni données temps réel.
        </p>
      </div>
      <div className="fleet-float-panel absolute left-0 top-24 z-[3] flex items-center gap-3 rounded-[10px] bg-[#161616] px-4 py-3 text-white shadow-[var(--shadow-elevated)] sm:left-[-10px] sm:top-[105px]">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-yellow font-black text-brand-ink">
          ⌖
        </span>
        <div>
          <small className="block text-[8px] text-[#aaaaaa]">Position actualisée</small>
          <strong className="text-[11px]">Schéma géographique</strong>
        </div>
      </div>
      <div className="fleet-float-panel fleet-float-panel--alt absolute bottom-8 right-0 z-[3] flex items-center gap-3 rounded-[10px] bg-brand-white px-4 py-3 text-brand-ink shadow-[var(--shadow-elevated)] sm:right-[-8px] sm:bottom-[72px]">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-yellow font-black">◉</span>
        <div>
          <small className="block text-[8px] text-brand-muted">Actifs supervisés</small>
          <strong className="text-[11px]">Vue illustrative</strong>
        </div>
      </div>
    </div>
  );
}

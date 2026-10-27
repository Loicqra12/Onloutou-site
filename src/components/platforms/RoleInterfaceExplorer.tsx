"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformIcon } from "@/components/platforms/PlatformIcons";
import { customPlatformRoles, type PlatformRoleId } from "@/content/custom-platforms-page";

const roleIcons: Record<PlatformRoleId, string> = {
  admin: "access",
  ops: "ops",
  partner: "partner",
  field: "field",
};

function RoleMock({ roleId, title, rows }: { roleId: PlatformRoleId; title: string; rows: string[] }) {
  return (
    <div className="platform-role-mock" aria-label={`${title} — illustration`}>
      <header className="platform-role-mock__head">
        <span className="platform-mock__dot" aria-hidden />
        <span className="platform-role-mock__head-title">{title}</span>
        <span className="platform-role-mock__badge">{roleId === "field" ? "Terrain" : "Espace"}</span>
      </header>
      <div className="platform-role-mock__body">
        <aside className="platform-role-mock__nav" aria-hidden>
          <span className="is-active">Vue d’ensemble</span>
          <span>Utilisateurs</span>
          <span>Documents</span>
          <span>Paramètres</span>
        </aside>
        <ul className="platform-role-mock__list">
          {rows.map((row) => (
            <li key={row}>
              <span>{row}</span>
              <span className="platform-role-mock__action">Consulter</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RoleInterfaceExplorer() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const roles = customPlatformRoles.roles;

  useEffect(() => {
    rootRef.current?.classList.add("platform-roles--tabs-ready");
  }, []);

  const selectTab = useCallback(
    (index: number) => {
      setActiveIndex((index + roles.length) % roles.length);
    },
    [roles.length],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(activeIndex - 1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(activeIndex + 1);
    }
  };

  return (
    <section
      id="roles-interfaces"
      className="platform-roles section-spacing scroll-mt-28"
      aria-labelledby="platform-roles-title"
    >
      <div className="container-content">
        <p className="platform-kicker">Rôles et parcours</p>
        <TitleReveal as="h2" id="platform-roles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformRoles.title}
        </TitleReveal>
        <p className="platform-roles__disclaimer">{customPlatformRoles.disclaimer}</p>

        <div ref={rootRef} className="platform-roles__explorer">
          <div
            role="tablist"
            aria-label="Rôles utilisateurs"
            className="platform-roles__tabs"
            onKeyDown={onKeyDown}
          >
            {roles.map((role, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-role-tab-${role.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-role-panel-${role.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`platform-roles__tab${selected ? " platform-roles__tab--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <PlatformIcon name={roleIcons[role.id]} />
                  <span className="platform-roles__tab-copy">
                    <strong>{role.label}</strong>
                    <em>{role.rows.slice(0, 2).join(" · ")}</em>
                  </span>
                  <span className="platform-roles__tab-arrow" aria-hidden>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          <span className="platform-roles__connector" aria-hidden />

          {roles.map((role, index) => {
            const selected = index === activeIndex;
            return (
              <div
                key={role.id}
                role="tabpanel"
                id={`${baseId}-role-panel-${role.id}`}
                aria-labelledby={`${baseId}-role-tab-${role.id}`}
                aria-hidden={!selected}
                className={`platform-roles__panel${selected ? " platform-roles__panel--active" : ""}`}
              >
                <RoleMock roleId={role.id} title={role.mockTitle} rows={role.rows} />
              </div>
            );
          })}

          <div className="platform-roles__stack">
            {roles.map((role) => (
              <article key={role.id} className="platform-roles__stack-item">
                <h3>{role.label}</h3>
                <RoleMock roleId={role.id} title={role.mockTitle} rows={role.rows} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchMe, isStaffRole, logout, type SessionUser } from "../api";
import { LOGO_SRC, SUPPORT_MAIL } from "../brand";
import { formatLongDate, initials, roleLabel } from "../lib/format";
import { ADMIN_NAV, findNavItem } from "../nav";
import { IconBell, IconChevron, IconHelp, IconSearch, NAV_ICONS } from "./NavIcons";

const COLLAPSE_KEY = "onloutou.admin.navCollapsed";

export type AdminOutlet = { user: SessionUser };

export function AdminShell() {
  const nav = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === "1");
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      const me = await fetchMe();
      if (!me.ok || !isStaffRole(me.data.user.role)) {
        nav("/login", { replace: true });
        return;
      }
      setUser(me.data.user);
    })();
  }, [nav, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setAlertsOpen(false);
  }, [location.pathname]);

  const current = useMemo(() => findNavItem(location.pathname), [location.pathname]);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fromForm = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    const q = fromForm || query.trim();
    nav(q ? `/dossiers?q=${encodeURIComponent(q)}` : "/dossiers");
  }

  async function onLogout() {
    await logout();
    nav("/login", { replace: true });
  }

  if (!user) {
    return (
      <div className="as as--boot">
        <p>Chargement de l’administration…</p>
      </div>
    );
  }

  const display = user.displayName?.trim() || user.email.split("@")[0] || "Équipe";

  return (
    <div className={`as${collapsed ? " as--collapsed" : ""}`}>
      <header className="as-top">
        <div className="as-brand">
          <span className="ag-logo">
            <img src={LOGO_SRC} alt="" width={191} height={82} />
            <span>ONLOUTOU</span>
          </span>
          <span className="ag-brand__rule" aria-hidden="true" />
          <span className="ag-brand__name">ONLOUTOU ADMINISTRATION</span>
        </div>
        <form className="as-search" onSubmit={onSearch} role="search">
          <IconSearch />
          <input
            name="q"
            type="search"
            placeholder="Rechercher un dossier, un client, un article…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un dossier, un client, un article"
          />
        </form>
        <div className="as-top__tools">
          <div className="as-pop">
            <button
              type="button"
              className="as-icon-btn"
              aria-label="Alertes"
              aria-expanded={alertsOpen}
              onClick={() => {
                setAlertsOpen((v) => !v);
                setMenuOpen(false);
              }}
            >
              <IconBell />
            </button>
            {alertsOpen ? (
              <div className="as-pop__panel" role="dialog" aria-label="Alertes">
                <p>Aucune alerte pour le moment.</p>
              </div>
            ) : null}
          </div>
          <div className="as-pop">
            <button
              type="button"
              className="as-user"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((v) => !v);
                setAlertsOpen(false);
              }}
            >
              <span className="as-avatar">{initials(user.displayName, user.email)}</span>
              <span className="as-user__meta">
                <strong>{display}</strong>
                <small>{roleLabel(user.role)}</small>
              </span>
            </button>
            {menuOpen ? (
              <div className="as-pop__panel as-pop__panel--menu" role="menu">
                <p>
                  {user.email}
                  <br />
                  {formatLongDate()}
                </p>
                <button type="button" onClick={() => void onLogout()}>
                  Se déconnecter
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="as-body">
        <aside className="as-nav" aria-label="Navigation administration">
          {ADMIN_NAV.map((section) => (
            <div key={section.id} className="as-nav__section">
              <p>{section.label}</p>
              {section.items.map((item) => {
                const Icon = NAV_ICONS[item.icon];
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={item.label}
                    className={({ isActive }) => `as-nav__link${isActive ? " is-active" : ""}`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    <IconChevron className="as-nav__chevron" />
                  </NavLink>
                );
              })}
            </div>
          ))}
          <div className="as-nav__foot">
            <a className="as-nav__link" href={SUPPORT_MAIL} title="Aide">
              <IconHelp />
              <span>Aide</span>
            </a>
            <button type="button" className="as-nav__link as-nav__collapse" onClick={toggleCollapsed}>
              <IconChevron className={collapsed ? "" : "is-flip"} />
              <span>{collapsed ? "Ouvrir le menu" : "Réduire le menu"}</span>
            </button>
          </div>
        </aside>
        <main className="as-main">
          <Outlet context={{ user, currentLabel: current?.label ?? "Administration" } satisfies AdminOutlet & { currentLabel: string }} />
        </main>
      </div>
    </div>
  );
}

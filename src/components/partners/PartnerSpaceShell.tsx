"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { apiFetch, clearCsrfToken } from "@/lib/api/client";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { dpPaths, dpSpace } from "@/content/devenir-partenaire";
import { DpIcon } from "@/components/partners/DpIcon";
import { firstName, initialFrom, usePartnerSession } from "@/components/partners/usePartnerSession";
import "@/styles/partner-space.css";

export function PartnerSpaceShell({ children }: { children: ReactNode }) {
  const { user, ready } = usePartnerSession();
  const router = useRouter();
  const pathname = usePathname() ?? dpPaths.home;
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingDemands, setPendingDemands] = useState(0);
  const [pendingLocations, setPendingLocations] = useState(0);
  const [pendingRevenues, setPendingRevenues] = useState(0);
  const [unreadNotices, setUnreadNotices] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace(`${dpPaths.login}?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, user, router, pathname]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const res = await apiFetch<{ pendingDemandCount?: number; pendingLocationCount?: number; unreadNotificationCount?: number; pendingRevenueCount?: number }>("/partner/me");
      if (res.ok) {
        setPendingDemands(res.data.pendingDemandCount ?? 0);
        setPendingLocations(res.data.pendingLocationCount ?? 0);
        setPendingRevenues(res.data.pendingRevenueCount ?? 0);
        setUnreadNotices(res.data.unreadNotificationCount ?? 0);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointer(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function logout() {
    setMenuOpen(false);
    await apiFetch("/auth/logout", { method: "POST" });
    clearCsrfToken();
    router.push(dpPaths.login);
    router.refresh();
  }

  if (!ready || !user) {
    return (
      <div className="ps-page">
        <p className="ps-main">Chargement de l’espace…</p>
      </div>
    );
  }

  const name = firstName(user.displayName);
  const initial = initialFrom(user.displayName);

  return (
    <div className="ps-page">
      <header className="ps-top">
        <div className="ps-top__brand">
          <BrandLogo theme="dark" />
          <span className="ps-top__rule" aria-hidden="true" />
          <span className="ps-badge">{dpSpace.badge}</span>
        </div>
        <div className="ps-top__tools">
          <Link href="/">{dpSpace.seeSite} ↗</Link>
          <span className="ps-top__sep" aria-hidden="true" />
          <Link href="/espace-partenaire/notifications" className="ps-bell" aria-label={dpSpace.notifications}>
            <DpIcon name="bell" />
            {unreadNotices > 0 ? <span className="ps-bell__n">{unreadNotices > 9 ? "9+" : unreadNotices}</span> : null}
          </Link>
          <span className="ps-top__sep" aria-hidden="true" />
          <div className="ps-account-menu" ref={menuRef}>
            <button
              type="button"
              className="ps-avatar-btn"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="ps-account-menu"
              aria-label={`Menu du compte, ${name}`}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="ps-avatar__mark" aria-hidden>{initial}</span>
              {name}
              <DpIcon name="chevron" />
            </button>
            {menuOpen ? (
              <div className="ps-menu" id="ps-account-menu" role="menu">
                <Link role="menuitem" href={dpPaths.account} onClick={() => setMenuOpen(false)}>
                  Mon compte
                </Link>
                <button type="button" role="menuitem" onClick={() => void logout()}>
                  Déconnexion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="ps-shell">
        <aside className="ps-side">
          <nav className="ps-nav" aria-label="Espace partenaire">
            {dpSpace.nav.map((item) => (
              <Link key={item.id} href={item.href} className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : undefined}>
                <DpIcon name={item.icon} />
                {item.label}
                {item.id === "demandes" && pendingDemands > 0 ? <span className="ps-nav__n">{pendingDemands}</span> : null}
                {item.id === "locations" && pendingLocations > 0 ? <span className="ps-nav__n">{pendingLocations}</span> : null}
                {item.id === "revenus" && pendingRevenues > 0 ? <span className="ps-nav__n">{pendingRevenues}</span> : null}
              </Link>
            ))}
          </nav>
          <div className="ps-side__help">
            <Link href={dpSpace.helpHref}>
              <DpIcon name="help" /> {dpSpace.help}
            </Link>
            <Link href={dpSpace.contactHref}>
              <DpIcon name="mail" /> {dpSpace.contact}
            </Link>
          </div>
        </aside>
        <div className="ps-main">{children}</div>
      </div>
    </div>
  );
}

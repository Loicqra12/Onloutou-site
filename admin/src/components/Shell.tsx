import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchMe, isStaffRole } from "../api";

export function Shell() {
  const nav = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const me = await fetchMe();
      if (!me.ok || !isStaffRole(me.data.user.role)) {
        nav("/login", { replace: true });
        return;
      }
      setReady(true);
    })();
  }, [nav, location.pathname]);

  if (!ready) {
    return (
      <div className="adm-page">
        <div className="adm-shell">
          <p>Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-shell">
        <p className="adm-kicker">Administration interne</p>
        <nav className="adm-nav" aria-label="Administration">
          <NavLink to="/demandes">Demandes</NavLink>
          <NavLink to="/candidatures">Candidatures</NavLink>
          <NavLink to="/produits">Produits</NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

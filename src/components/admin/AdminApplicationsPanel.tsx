"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type PartnerApp = {
  id: string;
  organizationName: string;
  status: string;
  user: { email: string; displayName: string | null };
};

type DriverApp = {
  id: string;
  fullName: string;
  status: string;
  user: { email: string };
};

export function AdminApplicationsPanel() {
  const router = useRouter();
  const [partners, setPartners] = useState<PartnerApp[]>([]);
  const [drivers, setDrivers] = useState<DriverApp[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const me = await apiFetch("/auth/me");
      if (!me.ok) {
        router.replace("/admin/login");
        return;
      }
      const p = await apiFetch<{ items: PartnerApp[] }>("/admin/applications/partners");
      const d = await apiFetch<{ items: DriverApp[] }>("/admin/applications/drivers");
      if (!p.ok) {
        setError(p.error);
        return;
      }
      if (!d.ok) {
        setError(d.error);
        return;
      }
      setPartners(p.data.items);
      setDrivers(d.data.items);
    })();
  }, [router]);

  async function reviewPartner(id: string, decision: "APPROVED" | "REJECTED") {
    const reason = decision === "REJECTED" ? "Motif à préciser ultérieurement." : undefined;
    const res = await apiFetch(`/admin/applications/partners/${id}`, {
      method: "PATCH",
      json: { decision, reason },
    });
    if (!res.ok) setError(res.error);
    else setPartners((rows) => rows.map((r) => (r.id === id ? { ...r, status: decision } : r)));
  }

  async function reviewDriver(id: string, decision: "APPROVED" | "REJECTED") {
    const res = await apiFetch(`/admin/applications/drivers/${id}`, {
      method: "PATCH",
      json: { decision, reason: decision === "REJECTED" ? "Motif à préciser." : undefined },
    });
    if (!res.ok) setError(res.error);
    else setDrivers((rows) => rows.map((r) => (r.id === id ? { ...r, status: decision } : r)));
  }

  if (error) return <p className="adm-error" role="alert">{error}</p>;

  return (
    <>
      <h2>Partenaires</h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Organisation</th>
              <th>E-mail</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((row) => (
              <tr key={row.id}>
                <td data-label="Organisation">{row.organizationName}</td>
                <td data-label="E-mail">{row.user.email}</td>
                <td data-label="Statut">{row.status}</td>
                <td className="adm-actions" data-label="Actions">
                  <button type="button" onClick={() => reviewPartner(row.id, "APPROVED")}>
                    Valider
                  </button>
                  <button type="button" onClick={() => reviewPartner(row.id, "REJECTED")}>
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Livreurs</h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>E-mail</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((row) => (
              <tr key={row.id}>
                <td data-label="Nom">{row.fullName}</td>
                <td data-label="E-mail">{row.user.email}</td>
                <td data-label="Statut">{row.status}</td>
                <td className="adm-actions" data-label="Actions">
                  <button type="button" onClick={() => reviewDriver(row.id, "APPROVED")}>
                    Valider
                  </button>
                  <button type="button" onClick={() => reviewDriver(row.id, "REJECTED")}>
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

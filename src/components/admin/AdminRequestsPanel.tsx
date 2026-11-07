"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRequestDetailView } from "@/components/admin/AdminRequestDetailView";
import type { AdminRequestDetail } from "@/lib/admin/requestDetailView";
import { apiFetch } from "@/lib/api/client";

type RequestRow = {
  id: string;
  reference: string;
  type: string;
  status: string;
  contactName: string;
  zone: string | null;
  createdAt: string;
};

export function AdminRequestsPanel() {
  const router = useRouter();
  const [items, setItems] = useState<RequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminRequestDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const me = await apiFetch<{ user: { role: string } }>("/auth/me");
      if (!me.ok) {
        router.replace("/admin/login");
        return;
      }
      const list = await apiFetch<{ items: RequestRow[] }>("/admin/requests?take=50");
      if (!list.ok) {
        setError(list.error);
        return;
      }
      setItems(list.data.items);
    })();
  }, [router]);

  async function loadDetail(id: string) {
    if (openId === id) {
      setOpenId(null);
      setDetail(null);
      return;
    }
    setOpenId(id);
    setDetailError(null);
    const res = await apiFetch<{ request: AdminRequestDetail }>(`/admin/requests/${id}`);
    if (!res.ok) {
      setDetailError(res.error);
      setDetail(null);
      return;
    }
    setDetail(res.data.request);
  }

  async function setStatus(id: string, status: string) {
    const res = await apiFetch(`/admin/requests/${id}/status`, {
      method: "PATCH",
      json: { status, note: "Mise à jour depuis l’administration." },
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    if (detail?.id === id) {
      setDetail({ ...detail, status });
    }
  }

  if (error) return <p className="adm-error" role="alert">{error}</p>;

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Contact</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <Fragment key={row.id}>
              <tr>
                <td data-label="Référence">{row.reference}</td>
                <td data-label="Type">{row.type}</td>
                <td data-label="Statut">{row.status}</td>
                <td data-label="Contact">{row.contactName}</td>
                <td data-label="Zone">{row.zone ?? "—"}</td>
                <td className="adm-actions" data-label="Actions">
                  <button type="button" onClick={() => void loadDetail(row.id)}>
                    {openId === row.id ? "Masquer" : "Détail"}
                  </button>
                  <button type="button" onClick={() => setStatus(row.id, "IN_REVIEW")}>
                    En cours
                  </button>
                  <button type="button" onClick={() => setStatus(row.id, "CLOSED")}>
                    Clôturer
                  </button>
                </td>
              </tr>
              {openId === row.id ? (
                <tr>
                  <td colSpan={6}>
                    {detailError ? <p className="adm-error" role="alert">{detailError}</p> : null}
                    {detail && detail.id === row.id ? (
                      <AdminRequestDetailView request={detail} />
                    ) : (
                      !detailError && <p>Chargement…</p>
                    )}
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

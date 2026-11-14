import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { RequestDetail } from "../components/RequestDetail";
import type { AdminRequestDetail } from "../lib/requestDetailView";

type RequestRow = {
  id: string;
  reference: string;
  type: string;
  status: string;
  contactName: string;
  zone: string | null;
  createdAt: string;
};

export function DemandesPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<RequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminRequestDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const list = await apiFetch<{ items: RequestRow[] }>("/admin/requests?take=50");
      if (!list.ok) {
        if (list.status === 401 || list.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(list.error);
        return;
      }
      setItems(list.data.items);
    })();
  }, [nav]);

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
    <>
      <h1 className="adm-h1">Demandes enregistrées</h1>
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
                    <button type="button" onClick={() => void setStatus(row.id, "IN_REVIEW")}>
                      En cours
                    </button>
                    <button type="button" onClick={() => void setStatus(row.id, "CLOSED")}>
                      Clôturer
                    </button>
                  </td>
                </tr>
                {openId === row.id ? (
                  <tr>
                    <td colSpan={6}>
                      {detailError ? <p className="adm-error" role="alert">{detailError}</p> : null}
                      {detail && detail.id === row.id ? (
                        <RequestDetail request={detail} />
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
    </>
  );
}

import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

type Card = {
  id: string;
  reference: string;
  productId: string;
  productTitle: string;
  productReference: string | null;
  ownerName: string;
  stage: "signale" | "diagnostic" | "en_cours" | "validation" | "clos";
  priority: "P1" | "P2" | "P3";
  problem: string;
  assigneeLabel: string;
  siteLabel: string;
  checklist: Record<string, boolean>;
  notes: string;
  costNote: string;
  imageUrl: string | null;
};

type Board = {
  counts: { enMaintenance: number; diagnostic: number; pieces: number; prets: number };
  columns: {
    signale: Card[];
    diagnostic: Card[];
    en_cours: Card[];
    validation: Card[];
  };
  items: Card[];
};

const STAGES: { id: keyof Board["columns"]; label: string }[] = [
  { id: "signale", label: "Signalé" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "en_cours", label: "En cours" },
  { id: "validation", label: "Validation" },
];

const NEXT: Record<string, Card["stage"] | null> = {
  signale: "diagnostic",
  diagnostic: "en_cours",
  en_cours: "validation",
  validation: "clos",
};

export function EntretienPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const prefillProduct = params.get("product") ?? "";
  const [board, setBoard] = useState<Board | null>(null);
  const [selected, setSelected] = useState<Card | null>(null);
  const [products, setProducts] = useState<{ id: string; title: string; reference: string }[]>([]);
  const [productId, setProductId] = useState(prefillProduct);
  const [problem, setProblem] = useState("");
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [mnt, arts] = await Promise.all([
      apiFetch<Board>("/admin/fleet/maintenance"),
      apiFetch<{ items: { id: string; title: string; reference: string }[] }>("/admin/fleet/articles?take=100"),
    ]);
    if (!mnt.ok) {
      if (mnt.status === 401 || mnt.status === 403) {
        nav("/login", { replace: true });
        return;
      }
      setError(mnt.error);
      return;
    }
    setBoard(mnt.data);
    if (arts.ok) setProducts(arts.data.items.map((i) => ({ id: i.id, title: i.title, reference: i.reference })));
    if (selected) {
      const fresh = mnt.data.items.find((i) => i.id === selected.id) || null;
      setSelected(fresh);
    }
  }

  useEffect(() => {
    void load();
  }, [nav]);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await apiFetch("/admin/fleet/maintenance", {
      method: "POST",
      json: { productId, problem, priority },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setProblem("");
    await load();
  }

  async function move(card: Card, stage: Card["stage"]) {
    setBusy(true);
    const res = await apiFetch(`/admin/fleet/maintenance/${card.productId}/${card.id}`, {
      method: "PATCH",
      json: { stage },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await load();
  }

  async function toggleCheck(card: Card, key: string) {
    const checklist = { ...card.checklist, [key]: !card.checklist[key] };
    setBusy(true);
    const res = await apiFetch(`/admin/fleet/maintenance/${card.productId}/${card.id}`, {
      method: "PATCH",
      json: { checklist },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await load();
  }

  if (error && !board) return <p className="as-error" role="alert">{error}</p>;
  if (!board) return <p className="as-empty">Chargement…</p>;

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Articles & parc / Entretien & immobilisations</span>
      </div>
      <h1 className="as-h1">Entretien & immobilisations</h1>
      <p className="as-lead">Kanban des interventions sur le parc et les articles partenaires.</p>

      <div className="as-kpis" style={{ marginBottom: "0.85rem" }}>
        <div className="as-kpi">
          <strong>{board.counts.enMaintenance}</strong>
          <span>En maintenance</span>
        </div>
        <div className="as-kpi">
          <strong>{board.counts.diagnostic}</strong>
          <span>Diagnostic</span>
        </div>
        <div className="as-kpi">
          <strong>{board.counts.pieces}</strong>
          <span>Pièces à suivre</span>
        </div>
        <div className="as-kpi">
          <strong>{board.counts.prets}</strong>
          <span>Prêts à valider</span>
        </div>
      </div>

      <form className="as-toolbar" onSubmit={(e) => void create(e)}>
        <select className="as-field" value={productId} onChange={(e) => setProductId(e.target.value)} required>
          <option value="">Article à immobiliser…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.reference} — {p.title}
            </option>
          ))}
        </select>
        <input
          className="as-field"
          placeholder="Problème constaté"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
        />
        <select className="as-field" value={priority} onChange={(e) => setPriority(e.target.value as "P1" | "P2" | "P3")}>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <button type="submit" className="as-btn as-btn--yellow" disabled={busy}>
          Ouvrir une intervention
        </button>
      </form>

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="as-kanban">
        {STAGES.map((col) => (
          <section key={col.id} className="as-kanban-col">
            <header>
              <strong>{col.label}</strong>
              <span>{board.columns[col.id].length}</span>
            </header>
            {board.columns[col.id].length === 0 ? (
              <p className="as-empty">Vide</p>
            ) : (
              board.columns[col.id].map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={`as-kanban-card ${selected?.id === card.id ? "is-active" : ""}`}
                  onClick={() => setSelected(card)}
                >
                  <div className="as-kanban-card__top">
                    <span className={`as-badge ${card.priority === "P1" ? "as-badge--warn" : "as-badge--info"}`}>{card.priority}</span>
                    <small>{card.reference}</small>
                  </div>
                  <strong>{card.productTitle}</strong>
                  <p>{card.problem}</p>
                  <small>
                    {card.siteLabel} · {card.assigneeLabel || "Non assigné"}
                  </small>
                </button>
              ))
            )}
          </section>
        ))}
      </div>

      {selected ? (
        <section className="as-card" style={{ marginTop: "0.85rem" }}>
          <div className="as-toolbar">
            <h2 className="as-h2" style={{ margin: 0 }}>
              {selected.reference} · {selected.productTitle}
            </h2>
            <Link to={`/articles/${selected.productId}`}>Voir l’article</Link>
          </div>
          <p>{selected.problem}</p>
          <p className="as-note">
            {selected.ownerName} · {selected.siteLabel} · priorité {selected.priority}
          </p>
          <h3 className="as-h2">Checklist</h3>
          <div className="as-prop-pills">
            {["diagnostic", "pieces", "travaux", "controle", "remise"].map((key) => (
              <button key={key} type="button" className="as-btn" disabled={busy} onClick={() => void toggleCheck(selected, key)}>
                {selected.checklist[key] ? "✓" : "○"} {key}
              </button>
            ))}
          </div>
          <div className="as-toolbar" style={{ marginTop: "0.75rem" }}>
            {NEXT[selected.stage] ? (
              <button
                type="button"
                className="as-btn as-btn--yellow"
                disabled={busy}
                onClick={() => void move(selected, NEXT[selected.stage]!)}
              >
                {NEXT[selected.stage] === "clos" ? "Clôturer" : `Passer en ${NEXT[selected.stage]}`}
              </button>
            ) : null}
            {selected.stage !== "signale" ? (
              <button type="button" className="as-btn" disabled={busy} onClick={() => void move(selected, "signale")}>
                Revenir à signalé
              </button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

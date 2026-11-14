import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import { ABIDJAN_COMMUNES } from "../lib/communes";
import { formatDateRange, formatDayMonth, formatFcfa, parseAmount } from "../lib/format";
import { IconCheck, IconPlus, IconSearch } from "./NavIcons";
import { ConfirmationFlow, type ConfirmView } from "./ConfirmationFlow";
import { ProposalLifecycle, type LifecycleView } from "./ProposalLifecycle";

export type OfferRequest = {
  id: string;
  status: string;
  zone: string | null;
  message: string;
  payload?: Record<string, unknown> | null;
  period?: { period: string | null; place: string | null };
  reference?: string;
  contactName?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  organization?: string | null;
  stage?: string;
  events?: { status: string; createdAt: string; note: string | null }[];
};

type CatalogHit = {
  id: string;
  title: string;
  reference: string | null;
  imageUrl: string | null;
  ownerKind: "onloutou" | "partner";
  ownerName: string;
  commune: string;
  hint: { label: string; tone: "warn" | "info" | "ok" | "muted"; note?: string };
  stock: { total: number; available: number; unavailable: number };
};

type SelectionItem = {
  productId: string;
  title: string;
  reference: string | null;
  quantity: number;
  imageUrl: string | null;
  ownerKind: "onloutou" | "partner";
  ownerName: string;
  commune: string;
  demandId?: string | null;
  hint?: { label: string; tone: string; note?: string };
};

type ProposalLine = {
  productId: string;
  clientPrice: string;
  priceUnit: string;
  partnerAmount: string;
};

type View = "search" | "ask" | "proposal" | LifecycleView | ConfirmView;

type Props = {
  request: OfferRequest;
  onUpdated: (request: OfferRequest) => void;
  initialView?: View;
  onOrganizeDelivery?: () => void;
};

function resolveConfirmView(request: OfferRequest): ConfirmView | null {
  const payload = asRecord(request.payload);
  const proposal = readProposal(request.payload);
  const rental = asRecord(payload.rental);
  const payment = asRecord(asRecord(payload.payment).initial);
  if (rental.status === "confirmed" || rental.reserved === true || payload.reserved === true) return "confirmed";
  if (payment.verified === true) return "confirm";
  if (proposal.clientResponse === "accepted" || rental.agreementReceived === true) return "agreement";
  return null;
}

function resolveInitialView(request: OfferRequest, initialView: View): View {
  const confirm = resolveConfirmView(request);
  if (confirm) return confirm;
  const proposal = readProposal(request.payload);
  if (proposal.status === "sent" || proposal.sentToClient === true) return "follow";
  if (
    initialView === "verify" ||
    initialView === "transmit" ||
    initialView === "follow" ||
    initialView === "agreement" ||
    initialView === "payment" ||
    initialView === "confirm" ||
    initialView === "confirmed"
  ) {
    return initialView;
  }
  if (proposal.status === "ready" && initialView === "proposal") return "verify";
  return initialView;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readSelection(payload: Record<string, unknown> | null | undefined): SelectionItem[] {
  const selection = asRecord(payload?.selection);
  const items = Array.isArray(selection.items) ? selection.items : [];
  const out: SelectionItem[] = [];
  for (const raw of items) {
    const row = asRecord(raw);
    if (typeof row.productId !== "string") continue;
    out.push({
      productId: row.productId,
      title: String(row.title ?? "Article"),
      reference: typeof row.reference === "string" ? row.reference : null,
      quantity: Number(row.quantity) || 1,
      imageUrl: typeof row.imageUrl === "string" ? row.imageUrl : null,
      ownerKind: row.ownerKind === "onloutou" ? "onloutou" : "partner",
      ownerName: String(row.ownerName ?? "Partenaire"),
      commune: String(row.commune ?? "—"),
      demandId: typeof row.demandId === "string" ? row.demandId : null,
      hint: row.hint && typeof row.hint === "object" ? (row.hint as SelectionItem["hint"]) : undefined,
    });
  }
  return out;
}

function readProposal(payload: Record<string, unknown> | null | undefined) {
  return asRecord(payload?.proposal);
}

function needSummary(request: OfferRequest) {
  const payload = asRecord(request.payload);
  const articles = Array.isArray(payload.articles) ? payload.articles : [];
  const first = articles[0] && typeof articles[0] === "object" ? (articles[0] as Record<string, unknown>) : null;
  const qty = articles.reduce((sum, row) => sum + (Number(asRecord(row).quantity) || 0), 0);
  const title = String(first?.title ?? payload.familyLabel ?? "Articles à sourcer");
  return {
    title: qty > 0 ? `${qty} × ${title}` : title,
    usage: String(payload.usageLabel ?? ""),
    startDate: typeof payload.startDate === "string" ? payload.startDate : "",
    endDate: typeof payload.endDate === "string" ? payload.endDate : "",
    commune: typeof payload.commune === "string" ? payload.commune : (request.zone?.split(",")[0]?.trim() ?? ""),
    city: typeof payload.city === "string" ? payload.city : "Abidjan",
    delivery: Boolean(payload.delivery),
    pickup: Boolean(payload.pickup),
    demanded: qty || 1,
  };
}

export function ArticlesOfferPanel({ request, onUpdated, initialView = "search", onOrganizeDelivery }: Props) {
  const payload = asRecord(request.payload);
  const first =
    Array.isArray(payload.articles) && payload.articles[0] && typeof payload.articles[0] === "object"
      ? (payload.articles[0] as Record<string, unknown>)
      : null;
  const need = needSummary(request);
  const savedSelection = readSelection(request.payload);
  const savedProposal = readProposal(request.payload);

  const [view, setView] = useState<View>(() => resolveInitialView(request, initialView));
  const [q, setQ] = useState(() => {
    const raw = String(first?.title ?? payload.familyLabel ?? "");
    return raw.replace(/\benviron\b/gi, " ").replace(/\s+/g, " ").trim().slice(0, 40);
  });
  const [owner, setOwner] = useState<"all" | "onloutou" | "partner">("all");
  const [commune, setCommune] = useState("");
  const [hits, setHits] = useState<CatalogHit[]>([]);
  const [selected, setSelected] = useState<SelectionItem[]>(savedSelection);
  const [askItem, setAskItem] = useState<SelectionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [askQty, setAskQty] = useState(1);
  const [askStart, setAskStart] = useState(need.startDate);
  const [askEnd, setAskEnd] = useState(need.endDate);
  const [askPlace, setAskPlace] = useState([need.commune, need.city].filter(Boolean).join(", "));
  const [askDelivery, setAskDelivery] = useState(need.delivery);
  const [askPickup, setAskPickup] = useState(need.pickup);
  const [askMessage, setAskMessage] = useState("");
  const [askReplyDate, setAskReplyDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [askReplyTime, setAskReplyTime] = useState("12:00");
  const [notifyEmail, setNotifyEmail] = useState(false);

  const [proposalLines, setProposalLines] = useState<ProposalLine[]>([]);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [pickupFee, setPickupFee] = useState("");
  const [deliveryIncluded, setDeliveryIncluded] = useState(false);
  const [pickupIncluded, setPickupIncluded] = useState(false);
  const [paymentInitial, setPaymentInitial] = useState("");
  const [balanceDue, setBalanceDue] = useState("");
  const [deposit, setDeposit] = useState<"todo" | "required" | "not_required">("todo");
  const [billingValidated, setBillingValidated] = useState(false);
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    setSelected(savedSelection);
  }, [request.id, savedSelection.length]);

  useEffect(() => {
    const confirm = resolveConfirmView(request);
    if (confirm) {
      setView(confirm);
      return;
    }
    const proposal = readProposal(request.payload);
    if (proposal.status === "sent" || proposal.sentToClient === true) {
      setView("follow");
      return;
    }
    if (proposal.status === "draft" || proposal.status === "ready") {
      setView((current) => (current === "follow" ? "proposal" : current));
    }
  }, [request.id]);

  useEffect(() => {
    const lines = (savedSelection.length ? savedSelection : selected).map((row) => {
      const existing = Array.isArray(savedProposal.lines)
        ? savedProposal.lines.find((line) => asRecord(line).productId === row.productId)
        : null;
      const line = asRecord(existing);
      return {
        productId: row.productId,
        clientPrice: String(line.clientPrice ?? ""),
        priceUnit: String(line.priceUnit ?? "Par période"),
        partnerAmount: String(line.partnerAmount ?? ""),
      };
    });
    setProposalLines(lines);
    setDeliveryFee(String(savedProposal.deliveryFee ?? ""));
    setPickupFee(String(savedProposal.pickupFee ?? ""));
    setDeliveryIncluded(Boolean(savedProposal.deliveryIncluded));
    setPickupIncluded(Boolean(savedProposal.pickupIncluded));
    setPaymentInitial(String(savedProposal.paymentInitial ?? ""));
    setBalanceDue(String(savedProposal.balanceDue ?? ""));
    setDeposit(
      savedProposal.deposit === "required" || savedProposal.deposit === "not_required"
        ? savedProposal.deposit
        : "todo",
    );
    setBillingValidated(Boolean(savedProposal.billingValidated));
    setValidUntil(typeof savedProposal.validUntil === "string" ? savedProposal.validUntil : "");
  }, [request.id, view]);

  useEffect(() => {
    if (view !== "search") return;
    const handle = window.setTimeout(() => {
      void (async () => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (owner !== "all") params.set("owner", owner);
        if (commune) params.set("commune", commune);
        if (need.startDate) params.set("startDate", need.startDate);
        if (need.endDate) params.set("endDate", need.endDate);
        const res = await apiFetch<{ items: CatalogHit[] }>(`/admin/requests/${request.id}/articles?${params}`);
        if (res.ok) setHits(res.data.items);
      })();
    }, 200);
    return () => window.clearTimeout(handle);
  }, [view, q, owner, commune, need.startDate, need.endDate, request.id]);

  const selectedIds = useMemo(() => new Set(selected.map((row) => row.productId)), [selected]);
  const onlCount = selected.filter((row) => row.ownerKind === "onloutou").length;
  const partnerCount = selected.filter((row) => row.ownerKind === "partner").length;
  const partnerSelected = selected.filter((row) => row.ownerKind === "partner");
  const onlSelected = selected.filter((row) => row.ownerKind === "onloutou");

  const pricesDone = proposalLines.length > 0 && proposalLines.every((line) => line.clientPrice.trim().length > 0);
  const partnerAmountsDone = proposalLines
    .filter((line) => selected.find((row) => row.productId === line.productId)?.ownerKind === "partner")
    .every((line) => line.partnerAmount.trim().length > 0);
  const transportDone = (deliveryIncluded || deliveryFee.trim().length > 0) && (pickupIncluded || pickupFee.trim().length > 0);
  const conditionsDone = Boolean(paymentInitial) && Boolean(balanceDue) && deposit !== "todo";
  const contactsDone = Boolean(request.contactEmail || request.contactPhone);
  const canVerify = pricesDone && partnerAmountsDone && transportDone && conditionsDone && billingValidated && contactsDone;

  const draftTotal = proposalLines.reduce((sum, line) => {
    const qty = selected.find((row) => row.productId === line.productId)?.quantity ?? 1;
    return sum + (parseAmount(line.clientPrice) ?? 0) * qty;
  }, 0) + (deliveryIncluded ? 0 : parseAmount(deliveryFee) ?? 0) + (pickupIncluded ? 0 : parseAmount(pickupFee) ?? 0);

  function toggleHit(hit: CatalogHit) {
    setNotice(null);
    setSelected((current) => {
      if (current.some((row) => row.productId === hit.id)) {
        return current.filter((row) => row.productId !== hit.id);
      }
      return [
        ...current,
        {
          productId: hit.id,
          title: hit.title,
          reference: hit.reference,
          quantity: 1,
          imageUrl: hit.imageUrl,
          ownerKind: hit.ownerKind,
          ownerName: hit.ownerName,
          commune: hit.commune,
          hint: hit.hint,
        },
      ];
    });
  }

  async function saveSelection() {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/selection`, {
      method: "PATCH",
      json: { items: selected.map((row) => ({ productId: row.productId, quantity: row.quantity })) },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setSelected(readSelection(res.data.request.payload));
    setNotice("Sélection enregistrée. Aucun stock n’est bloqué.");
  }

  function openAsk(item: SelectionItem) {
    setAskItem(item);
    setAskQty(item.quantity);
    setAskStart(need.startDate);
    setAskEnd(need.endDate);
    setAskPlace([need.commune || item.commune, need.city].filter(Boolean).join(", "));
    setAskDelivery(need.delivery);
    setAskPickup(need.pickup);
    setAskMessage(
      `Bonjour,\n\nPouvons-nous confirmer la disponibilité de « ${item.title} » (${item.reference ?? "sans réf."}) pour ${item.quantity} appareil(s) du ${formatDayMonth(need.startDate) || "…"} au ${formatDayMonth(need.endDate) || "…"} à ${need.commune || item.commune} ?\n\nMerci d’indiquer le prix, les possibilités de livraison/reprise et toute condition particulière.\n\nCordialement,\nÉquipe ONLOUTOU`,
    );
    setView("ask");
    setError(null);
    setNotice(null);
  }

  async function transmitDemand() {
    if (!askItem) return;
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; demand: { reference: string }; request: OfferRequest }>(
      `/admin/requests/${request.id}/partner-demands`,
      {
        method: "POST",
        json: {
          productId: askItem.productId,
          quantity: askQty,
          startDate: askStart,
          endDate: askEnd,
          commune: need.commune || askItem.commune,
          delivery: askDelivery,
          pickup: askPickup,
          placeLabel: askPlace,
          message: askMessage,
          replyByDate: askReplyDate,
          replyByTime: askReplyTime,
          notifyEmail,
        },
      },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setSelected(readSelection(res.data.request.payload));
    setNotice(`Demande ${res.data.demand.reference} transmise. La réponse ne confirme pas la location.`);
    setView("search");
    setAskItem(null);
  }

  async function checkPark() {
    const target = onlSelected[0];
    if (!target) {
      setError("Sélectionnez d’abord un article du parc ONLOUTOU.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/park-check`, {
      method: "PATCH",
      json: { productId: target.productId },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onUpdated(res.data.request);
    setSelected(readSelection(res.data.request.payload));
    setNotice("Contrôle du parc enregistré. Aucun article réservé.");
  }

  async function saveProposal(options?: { openVerify?: boolean }) {
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: OfferRequest }>(`/admin/requests/${request.id}/proposal`, {
      method: "PATCH",
      json: {
        lines: proposalLines,
        deliveryFee,
        pickupFee,
        deliveryIncluded,
        pickupIncluded,
        paymentInitial,
        balanceDue,
        deposit,
        billingValidated,
        validUntil: validUntil || undefined,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    onUpdated(res.data.request);
    setNotice("Brouillon de proposition enregistré. Aucune offre n’a été envoyée au client.");
    if (options?.openVerify) setView("verify");
    return true;
  }

  if (view === "agreement" || view === "payment" || view === "confirm" || view === "confirmed") {
    return (
      <ConfirmationFlow
        request={request}
        view={view}
        onView={setView}
        onUpdated={onUpdated}
        onOrganizeDelivery={onOrganizeDelivery}
      />
    );
  }

  if (view === "verify" || view === "transmit" || view === "follow") {
    return (
      <ProposalLifecycle
        request={request}
        view={view}
        onView={setView}
        onOpenConfirmation={() => setView("agreement")}
        onBackToDraft={() => setView("proposal")}
        onUpdated={onUpdated}
      />
    );
  }

  if (view === "ask" && askItem) {
    return (
      <div className="as-offer">
        <div className="as-head" style={{ marginBottom: "0.85rem" }}>
          <div>
            <h2 className="as-h1" style={{ fontSize: "1.35rem" }}>
              Interroger {askItem.ownerName}
            </h2>
            <p className="as-lead">Transmettez dates, quantité et services. La réponse prépare l’offre, elle ne confirme pas la location.</p>
          </div>
        </div>
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Demande au partenaire</h2>
              <div className="as-art as-art--offer">
                {askItem.imageUrl ? <img src={askItem.imageUrl} alt="" /> : <i className="as-art__ph" />}
                <div>
                  <strong>{askItem.title}</strong>
                  <small>Réf. {askItem.reference || "—"}</small>
                </div>
              </div>
              <div className="as-form-grid">
                <label>
                  Quantité
                  <input type="number" min={1} value={askQty} onChange={(e) => setAskQty(Number(e.target.value) || 1)} />
                </label>
                <label>
                  Lieu
                  <input value={askPlace} onChange={(e) => setAskPlace(e.target.value)} />
                </label>
                <label>
                  Date de début
                  <input type="date" value={askStart} onChange={(e) => setAskStart(e.target.value)} />
                </label>
                <label>
                  Date de fin
                  <input type="date" value={askEnd} onChange={(e) => setAskEnd(e.target.value)} />
                </label>
              </div>
              <div className="as-checks">
                <label className="as-check">
                  <input type="checkbox" checked={askDelivery} onChange={(e) => setAskDelivery(e.target.checked)} />
                  Livraison
                </label>
                <label className="as-check">
                  <input type="checkbox" checked={askPickup} onChange={(e) => setAskPickup(e.target.checked)} />
                  Reprise
                </label>
              </div>
              <label>
                Message au partenaire
                <textarea className="as-field" rows={8} value={askMessage} onChange={(e) => setAskMessage(e.target.value)} />
              </label>
            </section>
            <section className="as-card">
              <h2>Réponse attendue</h2>
              <ul className="as-todo as-todo--done">
                <li>Disponibilité</li>
                <li>Prix</li>
                <li>Livraison / reprise</li>
                <li>Conditions particulières</li>
              </ul>
              <div className="as-form-grid">
                <label>
                  Date limite de réponse
                  <input type="date" value={askReplyDate} onChange={(e) => setAskReplyDate(e.target.value)} />
                </label>
                <label>
                  Heure
                  <input type="time" value={askReplyTime} onChange={(e) => setAskReplyTime(e.target.value)} />
                </label>
              </div>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Destinataire</h2>
              <p>
                <strong>{askItem.ownerName}</strong>
                <br />
                <span className="as-badge as-badge--stage">Partenaire approuvé</span>
              </p>
              <p>
                <small>Référence article</small>
                {askItem.reference || "—"}
              </p>
            </section>
            <section className="as-card as-side">
              <h2>Informations transmises</h2>
              <ul className="as-todo as-todo--done">
                <li>Article et référence</li>
                <li>Quantité</li>
                <li>Dates</li>
                <li>Lieu</li>
                <li>Services</li>
              </ul>
              <p className="as-note">Les coordonnées du client et les notes internes ne sont pas partagées.</p>
            </section>
            <section className="as-card as-side">
              <h2>Canal d’envoi</h2>
              <label className="as-channel is-on">
                <input type="radio" checked readOnly />
                Espace partenaire
              </label>
              <label className="as-check" style={{ marginTop: "0.7rem" }}>
                <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                Notifier aussi par e-mail
              </label>
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => setView("search")}>
            Annuler
          </button>
          <button type="button" className="as-btn as-btn--yellow" disabled={pending || askMessage.trim().length < 8} onClick={() => void transmitDemand()}>
            {pending ? "Transmission…" : "Transmettre la demande"}
          </button>
        </div>
        <p className="as-note">La réponse du partenaire permettra de préparer l’offre. Elle ne confirme pas la location.</p>
      </div>
    );
  }

  if (view === "proposal") {
    const availOk = selected.some((row) => /disponible|parc contrôlé/i.test(row.hint?.label ?? ""));
    return (
      <div className="as-offer">
        {availOk ? (
          <p className="as-banner as-banner--ok">Disponibilités vérifiées pour la période · Aucun article réservé</p>
        ) : (
          <p className="as-note">Les disponibilités restent à confirmer. Vous pouvez préparer le brouillon sans réserver le stock.</p>
        )}
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="as-note">{notice}</p> : null}
        <div className="as-grid">
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card">
              <h2>Articles et prestations</h2>
              {selected.length === 0 ? (
                <p className="as-empty">Enregistrez d’abord une sélection d’articles.</p>
              ) : (
                selected.map((row) => {
                  const line = proposalLines.find((item) => item.productId === row.productId);
                  return (
                    <div className="as-prop-line" key={row.productId}>
                      <div className="as-art as-art--offer">
                        {row.imageUrl ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                        <div>
                          <strong>{row.title}</strong>
                          <small>
                            {row.ownerName} · Réf. {row.reference || "—"}
                          </small>
                          <div className="as-prop-pills">
                            <span className={`as-badge ${row.ownerKind === "onloutou" ? "as-badge--warn" : "as-badge--stage"}`}>
                              {row.ownerKind === "onloutou" ? "ONLOUTOU" : row.ownerName}
                            </span>
                            <span className="as-badge as-badge--stage">{row.hint?.label ?? "À confirmer"}</span>
                            <span className="as-badge">Non réservé</span>
                          </div>
                        </div>
                      </div>
                      <div className="as-form-grid">
                        <label>
                          Prix client
                          <input
                            value={line?.clientPrice ?? ""}
                            placeholder="À renseigner FCFA"
                            onChange={(e) =>
                              setProposalLines((rows) =>
                                rows.map((item) => (item.productId === row.productId ? { ...item, clientPrice: e.target.value } : item)),
                              )
                            }
                          />
                        </label>
                        <label>
                          Unité de tarification
                          <select
                            value={line?.priceUnit ?? "Par période"}
                            onChange={(e) =>
                              setProposalLines((rows) =>
                                rows.map((item) => (item.productId === row.productId ? { ...item, priceUnit: e.target.value } : item)),
                              )
                            }
                          >
                            <option>Par période</option>
                            <option>Par jour</option>
                            <option>Forfait</option>
                          </select>
                        </label>
                      </div>
                      {row.ownerKind === "partner" ? (
                        <label className="as-locked">
                          Interne — Montant dû au partenaire
                          <input
                            value={line?.partnerAmount ?? ""}
                            placeholder="Non visible du client · FCFA"
                            onChange={(e) =>
                              setProposalLines((rows) =>
                                rows.map((item) =>
                                  item.productId === row.productId ? { ...item, partnerAmount: e.target.value } : item,
                                ),
                              )
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                  );
                })
              )}
              <div className="as-form-grid" style={{ marginTop: "0.85rem" }}>
                <label>
                  Frais de livraison
                  <input value={deliveryFee} disabled={deliveryIncluded} onChange={(e) => setDeliveryFee(e.target.value)} placeholder="FCFA" />
                </label>
                <label className="as-check" style={{ alignSelf: "end" }}>
                  <input type="checkbox" checked={deliveryIncluded} onChange={(e) => setDeliveryIncluded(e.target.checked)} />
                  Inclus
                </label>
                <label>
                  Frais de reprise
                  <input value={pickupFee} disabled={pickupIncluded} onChange={(e) => setPickupFee(e.target.value)} placeholder="FCFA" />
                </label>
                <label className="as-check" style={{ alignSelf: "end" }}>
                  <input type="checkbox" checked={pickupIncluded} onChange={(e) => setPickupIncluded(e.target.checked)} />
                  Inclus
                </label>
              </div>
            </section>
            <section className="as-card">
              <h2>Conditions de l’offre</h2>
              <div className="as-form-grid">
                <label>
                  Paiement initial
                  <select value={paymentInitial} onChange={(e) => setPaymentInitial(e.target.value)}>
                    <option value="">À définir</option>
                    <option value="acompte_30">Acompte 30 %</option>
                    <option value="acompte_50">Acompte 50 %</option>
                    <option value="total">Total avant livraison</option>
                  </select>
                </label>
                <label>
                  Échéance du solde
                  <select value={balanceDue} onChange={(e) => setBalanceDue(e.target.value)}>
                    <option value="">À définir</option>
                    <option value="before_delivery">Avant livraison</option>
                    <option value="on_delivery">À la livraison</option>
                    <option value="after_return">Après reprise</option>
                  </select>
                </label>
              </div>
              <div className="as-checks">
                <label className="as-check">
                  <input type="radio" name="deposit" checked={deposit === "todo"} onChange={() => setDeposit("todo")} />
                  Dépôt à définir
                </label>
                <label className="as-check">
                  <input type="radio" name="deposit" checked={deposit === "required"} onChange={() => setDeposit("required")} />
                  Requis
                </label>
                <label className="as-check">
                  <input type="radio" name="deposit" checked={deposit === "not_required"} onChange={() => setDeposit("not_required")} />
                  Non requis
                </label>
              </div>
            </section>
            <section className="as-card">
              <h2>Facturation</h2>
              <div className="as-prop-pills">
                <span className={`as-badge ${billingValidated ? "as-badge--stage" : "as-badge--warn"}`}>
                  Entité facturante · {billingValidated ? "Validée pour cette offre" : "À confirmer"}
                </span>
                <span className="as-badge">Traitement fiscal · À valider au besoin</span>
              </div>
              <p className="as-empty" style={{ marginTop: "0.7rem" }}>
                Le propriétaire affiché ne décide pas qui facture ni comment appliquer la TVA.
              </p>
              <label className="as-check" style={{ marginTop: "0.75rem" }}>
                <input type="checkbox" checked={billingValidated} onChange={(e) => setBillingValidated(e.target.checked)} />
                Facturation validée pour cette proposition
              </label>
              <label style={{ marginTop: "0.75rem" }}>
                Valable jusqu’au
                <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              </label>
            </section>
          </div>
          <aside style={{ display: "grid", gap: "0.85rem" }}>
            <section className="as-card as-side">
              <h2>Offre client</h2>
              <p>
                <small>Articles</small>
                <span className={`as-badge ${pricesDone ? "as-badge--stage" : "as-badge--warn"}`}>
                  {pricesDone ? "Renseignés" : "À compléter"}
                </span>
              </p>
              <p>
                <small>Transport</small>
                <span className={`as-badge ${transportDone ? "as-badge--stage" : "as-badge--warn"}`}>
                  {transportDone ? "Renseigné" : "À compléter"}
                </span>
              </p>
              <p>
                <small>Taxes</small>
                <span className={`as-badge ${billingValidated ? "as-badge--stage" : "as-badge--warn"}`}>
                  {billingValidated ? "Validées" : "À valider"}
                </span>
              </p>
              <p className="as-total">
                <small>Total</small>
                {pricesDone ? formatFcfa(draftTotal) : "Non calculé"}
              </p>
              <p>
                <small>Dépôt de garantie</small>
                <span className={`as-badge ${deposit === "todo" ? "as-badge--warn" : "as-badge--stage"}`}>
                  {deposit === "todo" ? "À définir" : deposit === "required" ? "Requis" : "Non requis"}
                </span>
              </p>
            </section>
            <section className="as-card as-side">
              <h2>Avant l’envoi</h2>
              <ul className="as-todo">
                <li className={pricesDone ? "is-done" : ""}>Renseigner les tarifs</li>
                <li className={conditionsDone ? "is-done" : ""}>Définir les conditions</li>
                <li className={billingValidated ? "is-done" : ""}>Valider la facturation</li>
                <li className={contactsDone ? "is-done" : ""}>Compléter l’adresse et le contact</li>
              </ul>
              {!contactsDone ? (
                <p className="as-note">Ajoutez un e-mail ou un téléphone client sur le dossier avant transmission.</p>
              ) : null}
            </section>
          </aside>
        </div>
        <div className="as-wiz-foot">
          <button type="button" className="as-btn" onClick={() => setView("search")}>
            ← Retour à la sélection
          </button>
          <div className="as-head__actions">
            <button type="button" className="as-btn" disabled={pending || selected.length === 0} onClick={() => void saveProposal()}>
              {pending ? "Enregistrement…" : "Enregistrer le brouillon"}
            </button>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={!canVerify || pending}
              onClick={() => void saveProposal({ openVerify: true })}
            >
              Vérifier avant envoi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="as-offer">
      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="as-note">{notice}</p> : null}
      <div className="as-grid">
        <section className="as-card">
          <h2>Trouver les articles adaptés</h2>
          <div className="as-need-row">
            <i className="as-art__ph" />
            <div>
              <strong>Besoin : {need.title}</strong>
              <small>{need.usage || "Description libre du besoin client"}</small>
            </div>
          </div>
          <div className="as-offer-filters">
            <div className="as-search as-search--inset" style={{ maxWidth: "none" }}>
              <IconSearch />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Article ou catégorie" aria-label="Rechercher un article" />
            </div>
            <select value={owner} onChange={(e) => setOwner(e.target.value as typeof owner)} aria-label="Propriétaire">
              <option value="all">Tous les propriétaires</option>
              <option value="onloutou">ONLOUTOU</option>
              <option value="partner">Partenaires</option>
            </select>
            <select value={commune} onChange={(e) => setCommune(e.target.value)} aria-label="Commune">
              <option value="">Toutes les communes</option>
              {ABIDJAN_COMMUNES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <span className="as-period-chip">
              {need.startDate && need.endDate ? formatDateRange(need.startDate, need.endDate) : "Période à préciser"}
            </span>
          </div>
          {hits.length === 0 ? (
            <p className="as-empty">Aucun article publié ne correspond pour l’instant.</p>
          ) : (
            <div className="as-offer-table">
              {hits.map((hit) => {
                const on = selectedIds.has(hit.id);
                return (
                  <button
                    key={hit.id}
                    type="button"
                    className={`as-offer-row${on ? " is-on" : ""}`}
                    onClick={() => toggleHit(hit)}
                  >
                    <span className="as-offer-check">{on ? <IconCheck /> : null}</span>
                    {hit.imageUrl ? <img src={hit.imageUrl} alt="" /> : <i className="as-art__ph" />}
                    <span>
                      <strong>{hit.title}</strong>
                      <small>Réf. {hit.reference || "—"}</small>
                    </span>
                    <span className={`as-badge ${hit.ownerKind === "onloutou" ? "as-badge--warn" : "as-badge--stage"}`}>
                      {hit.ownerKind === "onloutou" ? "ONLOUTOU" : hit.ownerName}
                    </span>
                    <span className="as-empty">{hit.commune}</span>
                    <span className={`as-hint as-hint--${hit.hint.tone}`}>
                      {hit.hint.label}
                      {hit.hint.note ? <small>{hit.hint.note}</small> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="as-art-add" style={{ marginTop: "0.9rem" }}>
            <span className="as-empty">Vous ne trouvez pas l’article ?</span>
            <button type="button" className="as-btn" onClick={() => setOwner("all")}>
              Élargir la recherche
            </button>
            <button type="button" className="as-btn as-btn--ghost" disabled title="Bientôt">
              <IconPlus /> Décrire un article à rechercher
            </button>
          </div>
        </section>

        <aside className="as-card as-side">
          <h2>Sélection envisagée</h2>
          <p>
            <strong>
              {`${selected.length} article${selected.length > 1 ? "s" : ""} / ${need.demanded} demandé${need.demanded > 1 ? "s" : ""}`}
            </strong>
            <br />
            <span className="as-empty">
              {onlCount} ONLOUTOU + {partnerCount} partenaire{partnerCount > 1 ? "s" : ""}
            </span>
          </p>
          <p className="as-banner as-banner--warn">Disponibilités non confirmées</p>
          <div className="as-sel-list">
            {selected.length === 0 ? (
              <p className="as-empty">Cochez des articles dans la liste.</p>
            ) : (
              selected.map((row) => (
                <div key={row.productId} className="as-sel-item">
                  {row.imageUrl ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
                  <div>
                    <strong>{row.title}</strong>
                    <small>
                      {row.ownerName} · {row.reference || "sans réf."}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="as-head__actions" style={{ marginTop: "0.85rem", flexDirection: "column" }}>
            <button
              type="button"
              className="as-btn as-btn--yellow"
              disabled={partnerSelected.length === 0}
              onClick={() => {
                const target = partnerSelected.find((row) => !row.demandId) || partnerSelected[0];
                if (target) openAsk(target);
              }}
            >
              Demander au partenaire →
            </button>
            <button type="button" className="as-btn" disabled={onlSelected.length === 0 || pending} onClick={() => void checkPark()}>
              Contrôler le parc ONLOUTOU
            </button>
            <button type="button" className="as-btn as-btn--ghost" disabled={selected.length === 0} onClick={() => setView("proposal")}>
              Préparer la proposition
            </button>
          </div>
        </aside>
      </div>
      <div className="as-wiz-foot">
        <p className="as-note" style={{ margin: 0 }}>
          Cette sélection ne bloque aucun stock.
        </p>
        <button type="button" className="as-btn as-btn--yellow" disabled={pending || selected.length === 0} onClick={() => void saveSelection()}>
          {pending ? "Enregistrement…" : "Enregistrer la sélection"}
        </button>
      </div>
    </div>
  );
}

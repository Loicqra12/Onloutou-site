import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { apiFetch } from "../api";
import type { AdminOutlet } from "../components/AdminShell";
import { IconCheck, IconPhone, IconPlus, IconSearch, IconTrash, IconWeb, IconWhatsApp } from "../components/NavIcons";
import { ABIDJAN_COMMUNES, ARTICLE_UNITS } from "../lib/communes";
import {
  clearDraft,
  emptyDraft,
  loadDraft,
  newArticleKey,
  originLabel,
  saveDraft,
  type DossierDraft,
  type DraftArticle,
  type OriginKey,
} from "../lib/dossierDraft";
import { formatDateRange, formatDayMonth } from "../lib/format";

type Staff = { id: string; name: string; email: string };
type ContactHit = {
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  organization: string | null;
  zone: string | null;
  kind: "professional" | "individual";
};
type CatalogProduct = {
  id: string;
  title: string;
  category: string;
  images: { url: string }[];
};
type CreatedDossier = {
  id: string;
  reference: string;
  createdAt: string;
  stage?: string;
  assignee?: { displayName: string | null; email: string } | null;
};

const ORIGINS: { id: OriginKey; label: string; Icon: typeof IconPhone }[] = [
  { id: "phone", label: "Téléphone", Icon: IconPhone },
  { id: "whatsapp", label: "WhatsApp", Icon: IconWhatsApp },
  { id: "web", label: "Site", Icon: IconWeb },
  { id: "other", label: "Autre", Icon: IconPlus },
];

export function CreateDossierPage() {
  const nav = useNavigate();
  const { user } = useOutletContext<AdminOutlet>();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [draft, setDraft] = useState<DossierDraft>(() => emptyDraft(user.id));
  const [staff, setStaff] = useState<Staff[]>([]);
  const [contacts, setContacts] = useState<ContactHit[]>([]);
  const [contactQ, setContactQ] = useState("");
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [articleQ, setArticleQ] = useState("");
  const [freeTitle, setFreeTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<CreatedDossier | null>(null);
  const [savedLocal, setSavedLocal] = useState(false);

  useEffect(() => {
    const stored = loadDraft();
    setDraft(stored ? { ...stored, assigneeId: stored.assigneeId || user.id } : emptyDraft(user.id));
  }, [user.id]);

  useEffect(() => {
    void (async () => {
      const [team, products] = await Promise.all([
        apiFetch<{ items: Staff[] }>("/admin/requests/staff"),
        apiFetch<{ products: CatalogProduct[] }>("/catalog/products"),
      ]);
      if (team.ok) setStaff(team.data.items);
      if (products.ok) setCatalog(products.data.products);
    })();
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void (async () => {
        const res = await apiFetch<{ items: ContactHit[] }>(
          `/admin/requests/contacts?q=${encodeURIComponent(contactQ)}`,
        );
        if (res.ok) setContacts(res.data.items);
      })();
    }, 220);
    return () => window.clearTimeout(handle);
  }, [contactQ]);

  function patch(partial: Partial<DossierDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
    setSavedLocal(false);
    setError(null);
  }

  const assignee = staff.find((row) => row.id === draft.assigneeId);
  const assigneeName = assignee?.name || user.displayName?.trim() || user.email;
  const catalogHits = useMemo(() => {
    const q = articleQ.trim().toLowerCase();
    if (!q) return catalog.slice(0, 6);
    return catalog.filter((row) => row.title.toLowerCase().includes(q) || row.category.toLowerCase().includes(q)).slice(0, 8);
  }, [articleQ, catalog]);

  const services = [
    draft.delivery ? "Livraison" : null,
    draft.pickup ? "Reprise" : null,
    draft.install ? "Installation" : null,
  ].filter((label): label is string => Boolean(label));
  const articleSummary = draft.articles.length
    ? draft.articles.map((row) => `${row.quantity} ${row.unit.toLowerCase()}${row.quantity > 1 ? "s" : ""} · ${row.title}`).join(" · ")
    : "À préciser";

  function validateStep1(): string | null {
    if (!draft.contactName.trim() || draft.contactName.trim().length < 2) return "Indiquez le client.";
    if ((draft.origin === "phone" || draft.origin === "whatsapp") && !draft.contactPhone.trim()) {
      return "Indiquez un numéro pour un contact téléphone ou WhatsApp.";
    }
    if (!draft.assigneeId) return "Désignez un responsable.";
    if (!draft.contactDate) return "Indiquez la date de contact.";
    return null;
  }

  function validateStep2(): string | null {
    if (draft.articles.length === 0) return "Ajoutez au moins un article, même sans référence catalogue.";
    if (!draft.usage.trim() || draft.usage.trim().length < 3) return "Décrivez l’usage.";
    if (!draft.commune) return "Indiquez la commune.";
    if (!draft.datesToConfirm && (!draft.startDate || !draft.endDate)) {
      return "Indiquez les dates, ou cochez « Dates à préciser ».";
    }
    return null;
  }

  function persistLocal() {
    saveDraft(draft);
    setSavedLocal(true);
    nav("/dossiers");
  }

  function addArticle(row: Omit<DraftArticle, "key">) {
    patch({ articles: [...draft.articles, { ...row, key: newArticleKey() }] });
    setArticleQ("");
    setFreeTitle("");
  }

  async function createDossier() {
    const first = validateStep1();
    const second = validateStep2();
    if (first || second) {
      setError(first || second);
      setStep(first ? 1 : 2);
      return;
    }
    setPending(true);
    setError(null);
    const res = await apiFetch<{ ok: true; request: CreatedDossier }>("/admin/requests", {
      method: "POST",
      json: {
        origin: draft.origin,
        contactName: draft.contactName.trim(),
        contactPhone: draft.contactPhone.trim() || undefined,
        contactEmail: draft.contactEmail.trim() || undefined,
        organization: draft.organization.trim() || undefined,
        clientKind: draft.clientKind,
        assigneeId: draft.assigneeId,
        contactDate: draft.contactDate,
        internalNote: draft.internalNote.trim() || undefined,
        articles: draft.articles.map(({ title, quantity, unit, productId, familyLabel }) => ({
          title,
          quantity,
          unit,
          productId,
          familyLabel,
        })),
        startDate: draft.datesToConfirm ? undefined : draft.startDate,
        endDate: draft.datesToConfirm ? undefined : draft.endDate,
        datesToConfirm: draft.datesToConfirm,
        city: draft.city,
        commune: draft.commune,
        address: draft.address.trim() || undefined,
        usage: draft.usage.trim(),
        services: { delivery: draft.delivery, pickup: draft.pickup, install: draft.install },
        accessNotes: draft.accessNotes.trim() || undefined,
        clientRequestId: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    clearDraft();
    setCreated(res.data.request);
    setStep(4);
  }

  if (step === 4 && created) {
    return (
      <SuccessStep
        created={created}
        draft={draft}
        assigneeName={assigneeName}
        articleSummary={articleSummary}
        services={services}
        onAnother={() => {
          setCreated(null);
          setDraft(emptyDraft(user.id));
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="as-page as-wiz">
      <div className="as-crumb">
        <span>
          <Link to="/dossiers">Dossiers de location</Link> / Nouveau dossier
        </span>
      </div>
      <div className="as-head">
        <div>
          <h1 className="as-h1">Créer un dossier</h1>
          <p className="as-lead">
            {step === 1
              ? "Enregistrez un besoin reçu par téléphone, WhatsApp ou en personne."
              : step === 2
                ? "Saisissez les articles, même sans référence au catalogue."
                : `Brouillon · ${formatDayMonth(new Date().toISOString().slice(0, 10))}`}
          </p>
        </div>
        <div className="as-head__actions">
          <button type="button" className="as-btn" onClick={persistLocal}>
            Enregistrer et quitter
          </button>
        </div>
      </div>
      {savedLocal ? (
        <p className="as-note">Brouillon conservé sur cet appareil. Le dossier n’est pas encore créé.</p>
      ) : null}

      <ol className="as-wiz-steps">
        <li className={step === 1 ? "is-on" : step > 1 ? "is-done" : ""}>1. Client & origine</li>
        <li className={step === 2 ? "is-on" : step > 2 ? "is-done" : ""}>2. Besoin & organisation</li>
        <li className={step === 3 ? "is-on" : ""}>3. Vérifier</li>
      </ol>

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : null}

      {step === 1 ? (
        <StepOrigin
          draft={draft}
          patch={patch}
          contactQ={contactQ}
          setContactQ={setContactQ}
          contacts={contacts}
          staff={staff}
        />
      ) : null}
      {step === 2 ? (
        <StepNeed
          draft={draft}
          patch={patch}
          articleQ={articleQ}
          setArticleQ={setArticleQ}
          catalogHits={catalogHits}
          freeTitle={freeTitle}
          setFreeTitle={setFreeTitle}
          addArticle={addArticle}
        />
      ) : null}
      {step === 3 ? <StepReview draft={draft} assigneeName={assigneeName} onEdit={setStep} /> : null}

      <div className="as-wiz-foot">
        {step === 1 ? (
          <Link className="as-btn" to="/dossiers">
            Annuler
          </Link>
        ) : (
          <button type="button" className="as-btn" onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))}>
            ← Précédent
          </button>
        )}
        {step === 1 ? (
          <button
            type="button"
            className="as-btn as-btn--yellow"
            onClick={() => {
              const issue = validateStep1();
              if (issue) setError(issue);
              else setStep(2);
            }}
          >
            Continuer vers le besoin →
          </button>
        ) : null}
        {step === 2 ? (
          <button
            type="button"
            className="as-btn as-btn--yellow"
            onClick={() => {
              const issue = validateStep2();
              if (issue) setError(issue);
              else setStep(3);
            }}
          >
            Vérifier le dossier →
          </button>
        ) : null}
        {step === 3 ? (
          <button type="button" className="as-btn as-btn--yellow" disabled={pending} onClick={() => void createDossier()}>
            {pending ? "Création…" : "+ Créer le dossier"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function StepOrigin({
  draft,
  patch,
  contactQ,
  setContactQ,
  contacts,
  staff,
}: {
  draft: DossierDraft;
  patch: (partial: Partial<DossierDraft>) => void;
  contactQ: string;
  setContactQ: (value: string) => void;
  contacts: ContactHit[];
  staff: Staff[];
}) {
  return (
    <div className="as-grid">
      <div style={{ display: "grid", gap: "0.85rem" }}>
        <section className="as-card">
          <h2>Quelle est l’origine de la demande ?</h2>
          <div className="as-origin">
            {ORIGINS.map((row) => (
              <button
                key={row.id}
                type="button"
                className={`as-origin__btn${draft.origin === row.id ? " is-on" : ""}`}
                onClick={() => patch({ origin: row.id })}
              >
                <row.Icon />
                {row.label}
              </button>
            ))}
          </div>
        </section>

        <section className="as-card">
          <h2>À quel client rattacher ce dossier ?</h2>
          <div className="as-tabs">
            <button type="button" className={draft.clientMode === "existing" ? "is-on" : ""} onClick={() => patch({ clientMode: "existing" })}>
              Client existant
            </button>
            <button type="button" className={draft.clientMode === "new" ? "is-on" : ""} onClick={() => patch({ clientMode: "new" })}>
              Nouveau client
            </button>
          </div>
          {draft.clientMode === "existing" ? (
            <>
              <div className="as-search as-search--inset" style={{ maxWidth: "none", margin: "0.8rem 0" }}>
                <IconSearch />
                <input
                  value={contactQ}
                  onChange={(e) => setContactQ(e.target.value)}
                  placeholder="Rechercher par nom, téléphone ou e-mail"
                  aria-label="Rechercher un client"
                />
              </div>
              {contacts.length === 0 ? (
                <p className="as-empty">Aucun client déjà vu dans les dossiers. Passez sur « Nouveau client ».</p>
              ) : (
                <div className="as-contact-list">
                  {contacts.map((hit) => {
                    const selected =
                      draft.contactName === hit.contactName &&
                      (draft.contactPhone || "") === (hit.contactPhone || "");
                    return (
                      <button
                        key={`${hit.contactName}-${hit.contactPhone}`}
                        type="button"
                        className={`as-contact${selected ? " is-on" : ""}`}
                        onClick={() =>
                          patch({
                            contactName: hit.contactName,
                            organization: hit.organization ?? "",
                            contactPhone: hit.contactPhone ?? "",
                            contactEmail: hit.contactEmail ?? "",
                            clientKind: hit.kind,
                            commune: draft.commune || hit.zone?.split(",")[0]?.trim() || "",
                          })
                        }
                      >
                        <strong>{hit.organization || hit.contactName}</strong>
                        <span className="as-badge as-badge--stage">
                          {hit.kind === "professional" ? "Client professionnel" : "Particulier"}
                        </span>
                        <small>
                          {[hit.zone, hit.contactPhone].filter(Boolean).join(" · ") || "Coordonnées incomplètes"}
                        </small>
                        {selected ? <IconCheck /> : null}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="as-note">Vérifiez les coordonnées avant de créer un nouveau client.</p>
              <button type="button" className="as-btn as-btn--ghost" onClick={() => patch({ clientMode: "new" })}>
                <IconPlus /> Ajouter un nouveau client
              </button>
            </>
          ) : (
            <div className="as-form-grid">
              <label>
                Nom ou structure
                <input value={draft.contactName} onChange={(e) => patch({ contactName: e.target.value })} required />
              </label>
              <label>
                Organisation
                <input
                  value={draft.organization}
                  onChange={(e) =>
                    patch({
                      organization: e.target.value,
                      clientKind: e.target.value.trim() ? "professional" : "individual",
                    })
                  }
                />
              </label>
              <label>
                Téléphone
                <input value={draft.contactPhone} onChange={(e) => patch({ contactPhone: e.target.value })} />
              </label>
              <label>
                E-mail
                <input type="email" value={draft.contactEmail} onChange={(e) => patch({ contactEmail: e.target.value })} />
              </label>
            </div>
          )}
        </section>

        <section className="as-card">
          <h2>Suivi interne</h2>
          <div className="as-form-grid">
            <label>
              Responsable
              <select value={draft.assigneeId} onChange={(e) => patch({ assigneeId: e.target.value })}>
                <option value="">Choisir…</option>
                {staff.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date du contact
              <input type="date" value={draft.contactDate} onChange={(e) => patch({ contactDate: e.target.value })} />
            </label>
          </div>
          <label>
            Notes internes
            <textarea
              className="as-field"
              rows={3}
              value={draft.internalNote}
              onChange={(e) => patch({ internalNote: e.target.value })}
              placeholder="Visible uniquement par l’équipe."
            />
          </label>
        </section>
      </div>
      <aside className="as-card as-side">
        <h2>Votre dossier</h2>
        <p>
          <small>Source</small>
          <span className="as-badge as-badge--warn">{originLabel(draft.origin)}</span>
        </p>
        <p>
          <small>Client</small>
          {draft.organization || draft.contactName || "À préciser"}
        </p>
        <p>
          <small>Responsable</small>
          {staff.find((row) => row.id === draft.assigneeId)?.name || "À désigner"}
        </p>
        <p>
          <small>Articles</small>
          {draft.articles.length ? `${draft.articles.length} ligne${draft.articles.length > 1 ? "s" : ""}` : "À préciser"}
        </p>
        <p>
          <small>Période</small>
          {draft.datesToConfirm ? "À préciser" : formatDateRange(draft.startDate, draft.endDate)}
        </p>
        <p className="as-empty">Le dossier sera créé après vérification.</p>
      </aside>
    </div>
  );
}

function StepNeed({
  draft,
  patch,
  articleQ,
  setArticleQ,
  catalogHits,
  freeTitle,
  setFreeTitle,
  addArticle,
}: {
  draft: DossierDraft;
  patch: (partial: Partial<DossierDraft>) => void;
  articleQ: string;
  setArticleQ: (value: string) => void;
  catalogHits: CatalogProduct[];
  freeTitle: string;
  setFreeTitle: (value: string) => void;
  addArticle: (row: Omit<DraftArticle, "key">) => void;
}) {
  return (
    <div className="as-grid">
      <div style={{ display: "grid", gap: "0.85rem" }}>
        <section className="as-card">
          <h2>Que souhaite louer le client ?</h2>
          <div className="as-search as-search--inset" style={{ maxWidth: "none" }}>
            <IconSearch />
            <input
              value={articleQ}
              onChange={(e) => setArticleQ(e.target.value)}
              placeholder="Rechercher un article ou une catégorie"
              aria-label="Rechercher un article"
            />
          </div>
          {articleQ.trim() && catalogHits.length > 0 ? (
            <ul className="as-catalog">
              {catalogHits.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() =>
                      addArticle({
                        title: product.title,
                        quantity: 1,
                        unit: "Appareil",
                        productId: product.id,
                        imageUrl: product.images[0]?.url,
                        familyLabel: product.category,
                      })
                    }
                  >
                    {product.images[0]?.url ? <img src={product.images[0].url} alt="" /> : <i />}
                    <span>
                      <strong>{product.title}</strong>
                      <small>{product.category}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {draft.articles.map((row) => (
            <div className="as-art" key={row.key}>
              {row.imageUrl ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
              <div>
                <strong>{row.title}</strong>
                <small>{row.familyLabel || "Description libre"}</small>
                {!row.productId ? <span className="as-badge as-badge--warn">Besoin à sourcer</span> : null}
              </div>
              <label>
                Quantité
                <div className="as-qty">
                  <button
                    type="button"
                    aria-label="Diminuer"
                    onClick={() =>
                      patch({
                        articles: draft.articles.map((item) =>
                          item.key === row.key ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
                        ),
                      })
                    }
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) =>
                      patch({
                        articles: draft.articles.map((item) =>
                          item.key === row.key ? { ...item, quantity: Number(e.target.value) || 1 } : item,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label="Augmenter"
                    onClick={() =>
                      patch({
                        articles: draft.articles.map((item) =>
                          item.key === row.key ? { ...item, quantity: item.quantity + 1 } : item,
                        ),
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </label>
              <label>
                Unité
                <select
                  value={row.unit}
                  onChange={(e) =>
                    patch({
                      articles: draft.articles.map((item) => (item.key === row.key ? { ...item, unit: e.target.value } : item)),
                    })
                  }
                >
                  {ARTICLE_UNITS.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="as-icon-btn"
                style={{ color: "#111", background: "transparent" }}
                aria-label={`Retirer ${row.title}`}
                onClick={() => patch({ articles: draft.articles.filter((item) => item.key !== row.key) })}
              >
                <IconTrash />
              </button>
            </div>
          ))}
          <div className="as-art-add">
            <input
              value={freeTitle}
              onChange={(e) => setFreeTitle(e.target.value)}
              placeholder="Article introuvable ? Décrire librement"
            />
            <button
              type="button"
              className="as-btn"
              onClick={() => {
                if (freeTitle.trim().length < 2) return;
                addArticle({ title: freeTitle.trim(), quantity: 1, unit: "Appareil" });
              }}
            >
              <IconPlus /> Ajouter
            </button>
          </div>
          <p className="as-note">Le dossier peut être créé sans référence au catalogue.</p>
        </section>

        <section className="as-card">
          <h2>Période et lieu</h2>
          <div className="as-form-grid">
            <label>
              Date de début
              <input
                type="date"
                value={draft.startDate}
                disabled={draft.datesToConfirm}
                onChange={(e) => patch({ startDate: e.target.value })}
              />
            </label>
            <label>
              Date de fin
              <input
                type="date"
                value={draft.endDate}
                disabled={draft.datesToConfirm}
                onChange={(e) => patch({ endDate: e.target.value })}
              />
            </label>
          </div>
          <label className="as-check">
            <input
              type="checkbox"
              checked={draft.datesToConfirm}
              onChange={(e) => patch({ datesToConfirm: e.target.checked })}
            />
            Dates à préciser
          </label>
          <div className="as-form-grid">
            <label>
              Ville
              <select value={draft.city} onChange={(e) => patch({ city: e.target.value })}>
                <option>Abidjan</option>
                <option>Autre</option>
              </select>
            </label>
            <label>
              Commune
              <select value={draft.commune} onChange={(e) => patch({ commune: e.target.value })}>
                <option value="">Choisir…</option>
                {ABIDJAN_COMMUNES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Adresse précise
            <input
              value={draft.address}
              onChange={(e) => patch({ address: e.target.value })}
              placeholder="Adresse précise à compléter"
            />
          </label>
        </section>

        <section className="as-card">
          <h2>Usage et services</h2>
          <label>
            Usage (description courte)
            <textarea className="as-field" rows={3} value={draft.usage} onChange={(e) => patch({ usage: e.target.value })} />
          </label>
          <div className="as-checks">
            <label className="as-check">
              <input type="checkbox" checked={draft.delivery} onChange={(e) => patch({ delivery: e.target.checked })} />
              Livraison
            </label>
            <label className="as-check">
              <input type="checkbox" checked={draft.pickup} onChange={(e) => patch({ pickup: e.target.checked })} />
              Reprise
            </label>
            <label className="as-check">
              <input type="checkbox" checked={draft.install} onChange={(e) => patch({ install: e.target.checked })} />
              Installation
            </label>
          </div>
          <label>
            Contraintes d’accès
            <input
              value={draft.accessNotes}
              onChange={(e) => patch({ accessNotes: e.target.value })}
              placeholder="Étage, ascenseur, accès véhicule…"
            />
          </label>
        </section>
      </div>
      <aside className="as-card as-side">
        <h2>Résumé du dossier</h2>
        <p>
          <small>Origine</small>
          {originLabel(draft.origin)}
          {draft.contactPhone ? ` · ${draft.contactPhone}` : ""}
        </p>
        <p>
          <small>Client</small>
          {draft.organization || draft.contactName || "À préciser"}
        </p>
        <p>
          <small>Articles demandés</small>
          {draft.articles.length
            ? draft.articles.map((row) => `${row.quantity} ${row.unit.toLowerCase()}${row.quantity > 1 ? "s" : ""} · ${row.title}`).join(" ; ")
            : "À préciser"}
        </p>
        <p>
          <small>Période</small>
          {draft.datesToConfirm ? "À préciser" : formatDateRange(draft.startDate, draft.endDate)}
        </p>
        <p>
          <small>Lieu</small>
          {[draft.commune, draft.city].filter(Boolean).join(", ") || "À préciser"}
        </p>
        <p>
          <small>Services</small>
          {[draft.delivery && "Livraison", draft.pickup && "Reprise", draft.install && "Installation"].filter(Boolean).join(" et ") ||
            "—"}
        </p>
        <p className="as-empty">Propriétaire, disponibilité et tarif à confirmer lors de la préparation de l’offre.</p>
      </aside>
    </div>
  );
}

function StepReview({
  draft,
  assigneeName,
  onEdit,
}: {
  draft: DossierDraft;
  assigneeName: string;
  onEdit: (step: 1 | 2 | 3) => void;
}) {
  return (
    <div className="as-grid">
      <div style={{ display: "grid", gap: "0.85rem" }}>
        <h2 className="as-h1" style={{ fontSize: "1.45rem" }}>
          Vérifiez le dossier avant de le créer
        </h2>
        <section className="as-card">
          <div className="as-card__head">
            <h2>Client & origine</h2>
            <button type="button" className="as-btn as-btn--ghost" onClick={() => onEdit(1)}>
              Modifier
            </button>
          </div>
          <div className="as-need">
            <p>
              <small>Client</small>
              {draft.organization || draft.contactName}
              <br />
              <span className="as-badge as-badge--stage">
                {draft.clientKind === "professional" ? "Client professionnel" : "Particulier"}
              </span>
            </p>
            <p>
              <small>Téléphone</small>
              {draft.contactPhone || "—"}
            </p>
            <p>
              <small>Origine</small>
              {originLabel(draft.origin)}
            </p>
            <p>
              <small>Contact</small>
              {formatDayMonth(draft.contactDate)}
            </p>
          </div>
        </section>
        <section className="as-card">
          <div className="as-card__head">
            <h2>Besoin de location</h2>
            <button type="button" className="as-btn as-btn--ghost" onClick={() => onEdit(2)}>
              Modifier
            </button>
          </div>
          {draft.articles.map((row) => (
            <div className="as-art" key={row.key}>
              {row.imageUrl ? <img src={row.imageUrl} alt="" /> : <i className="as-art__ph" />}
              <div>
                <strong>{row.title}</strong>
                <small>
                  {row.quantity} {row.unit.toLowerCase()}
                  {row.quantity > 1 ? "s" : ""}
                </small>
                {!row.productId ? <span className="as-badge as-badge--warn">Besoin à sourcer</span> : null}
              </div>
            </div>
          ))}
          <div className="as-need" style={{ marginTop: "0.7rem" }}>
            <p>
              <small>Période</small>
              {draft.datesToConfirm ? "À préciser" : formatDateRange(draft.startDate, draft.endDate)}
            </p>
            <p>
              <small>Lieu</small>
              {[draft.commune, draft.city].filter(Boolean).join(", ")}
            </p>
            <p>
              <small>Services</small>
              {[draft.delivery && "Livraison", draft.pickup && "Reprise", draft.install && "Installation"].filter(Boolean).join(" et ") ||
                "—"}
            </p>
          </div>
        </section>
        <section className="as-card">
          <div className="as-card__head">
            <h2>Organisation interne</h2>
            <button type="button" className="as-btn as-btn--ghost" onClick={() => onEdit(1)}>
              Modifier
            </button>
          </div>
          <div className="as-need">
            <p>
              <small>Responsable</small>
              {assigneeName}
            </p>
            <p>
              <small>Prochaine action</small>
              <span className="as-badge as-badge--warn">Confirmer les disponibilités et le transport</span>
            </p>
            <p>
              <small>Échéance interne</small>
              {draft.startDate ? `Avant le ${formatDayMonth(draft.startDate)}` : "À poser après création"}
            </p>
          </div>
          {draft.internalNote ? <p className="as-note">{draft.internalNote}</p> : null}
        </section>
        <p className="as-note">Créer ce dossier ne réserve aucun article et n’envoie aucun message au client.</p>
      </div>
      <aside style={{ display: "grid", gap: "0.85rem" }}>
        <section className="as-card">
          <h2>Après votre confirmation</h2>
          <p>
            <span className="as-status">En qualification</span>
          </p>
          <ul className="as-todo">
            <li>Le dossier sera enregistré</li>
            <li>{assigneeName} sera responsable</li>
            <li>L’historique sera créé</li>
          </ul>
        </section>
        <section className="as-card">
          <h2>À compléter ensuite</h2>
          <ul className="as-todo">
            <li>Adresse précise</li>
            <li>Articles et propriétaires</li>
            <li>Disponibilités et prix</li>
            <li>Conditions de règlement</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}

function SuccessStep({
  created,
  draft,
  assigneeName,
  articleSummary,
  services,
  onAnother,
}: {
  created: CreatedDossier;
  draft: DossierDraft;
  assigneeName: string;
  articleSummary: string;
  services: string[];
  onAnother: () => void;
}) {
  return (
    <div className="as-page as-wiz">
      <div className="as-crumb">
        <span>
          <Link to="/dossiers">Dossiers de location</Link> / {created.reference}
        </span>
      </div>
      <div className="as-head">
        <div>
          <h1 className="as-h1 as-h1--ok">
            <IconCheck /> Le dossier est créé
          </h1>
          <p className="as-lead">
            {draft.organization || draft.contactName} · {created.reference}
          </p>
        </div>
        <span className="as-status">{created.stage ?? "En qualification"}</span>
      </div>
      <p className="as-banner as-banner--ok">
        {assigneeName} est responsable du suivi. Aucun message n’a été envoyé au client.
      </p>
      <div className="as-grid">
        <section className="as-card">
          <h2>Résumé de la demande</h2>
          <div className="as-need">
            <p>
              <small>Articles</small>
              {articleSummary}
            </p>
            <p>
              <small>Période</small>
              {draft.datesToConfirm ? "À préciser" : formatDateRange(draft.startDate, draft.endDate)}
            </p>
            <p>
              <small>Lieu</small>
              {[draft.commune, draft.city].filter(Boolean).join(", ")}
            </p>
            <p>
              <small>Source</small>
              {originLabel(draft.origin)}
              {draft.contactPhone ? ` · ${draft.contactPhone}` : ""}
            </p>
            <p>
              <small>Livraison / reprise</small>
              {services.join(" et ") || "—"}
            </p>
            <p>
              <small>Propriétaire (owner)</small>
              À déterminer
            </p>
          </div>
        </section>
        <section className="as-card">
          <h2>Avant de confirmer la location</h2>
          <ul className="as-todo">
            <li>Disponibilité des articles</li>
            <li>Proposition acceptée</li>
            <li>Paiement initial vérifié ou dérogation approuvée</li>
            <li>Conditions contractuelles renseignées</li>
          </ul>
          <p className="as-empty">Aucun article réservé · Aucun paiement enregistré</p>
        </section>
      </div>
      <section className="as-card">
        <h2>Prochaine action</h2>
        <p>
          <strong>Confirmer les disponibilités et le transport</strong>
        </p>
        <p className="as-empty">
          Responsable {assigneeName}
          {draft.startDate ? ` · Avant le ${formatDayMonth(draft.startDate)}` : ""} · Tâche à traiter
        </p>
        <div className="as-head__actions" style={{ marginTop: "0.85rem" }}>
          <Link className="as-btn as-btn--yellow" to={`/dossiers/${created.id}`}>
            Ouvrir le dossier →
          </Link>
          <button type="button" className="as-btn" onClick={onAnother}>
            Créer un autre dossier
          </button>
          <Link to="/dossiers">Retour à la liste</Link>
        </div>
      </section>
      <section className="as-card">
        <h2>Historique</h2>
        <p className="as-empty">
          {formatDayMonth(created.createdAt.slice(0, 10))} · Création manuelle · Source {originLabel(draft.origin)}
        </p>
      </section>
    </div>
  );
}

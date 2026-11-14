import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../api";
import { LOGIN_HERO_SRC } from "../brand";
import { AuthChrome } from "../components/AuthChrome";
import { IconLock } from "../components/Icons";

export function ResetPasswordPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) {
      setError("Lien incomplet. Demandez un nouvel envoi.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await confirmPasswordReset(token, password);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav("/login");
  }

  return (
    <AuthChrome
      heroSrc={LOGIN_HERO_SRC}
      heroAlt="Entrepôt ONLOUTOU : bureau, réfrigérateur et matériel prêt à partir."
    >
      <div className="ag-card">
        <Link className="ag-back" to="/login">
          ← Retour à la connexion
        </Link>
        <p className="ag-pill">
          <IconLock />
          Espace interne
        </p>
        <h2>Nouveau mot de passe</h2>
        <p className="ag-lead">Choisissez un mot de passe d’au moins 10 caractères.</p>
        <form className="ag-form" onSubmit={onSubmit}>
          <label htmlFor="adm-new-password">Nouveau mot de passe</label>
          <div className="ag-field">
            <IconLock />
            <input
              id="adm-new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={10}
              required
            />
          </div>
          {error ? (
            <p className="ag-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="ag-submit" disabled={pending || !token}>
            {pending ? "Enregistrement…" : "Enregistrer et se connecter"}
          </button>
        </form>
      </div>
    </AuthChrome>
  );
}

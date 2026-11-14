import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api";
import { LOGIN_HERO_SRC } from "../brand";
import { AuthChrome } from "../components/AuthChrome";
import { IconLock, IconMail } from "../components/Icons";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const res = await requestPasswordReset(email);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage(res.data.message);
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
        <h2>Mot de passe oublié</h2>
        <p className="ag-lead">
          Indiquez l’e-mail de votre compte. Si un envoi est possible, vous recevrez un lien valable une heure.
        </p>
        <form className="ag-form" onSubmit={onSubmit}>
          <label htmlFor="adm-reset-email">Adresse e-mail professionnelle</label>
          <div className="ag-field">
            <IconMail />
            <input
              id="adm-reset-email"
              type="email"
              autoComplete="username"
              placeholder="prenom@onloutou.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="ag-error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="ag-ok" role="status">
              {message}
            </p>
          ) : null}
          <button type="submit" className="ag-submit" disabled={pending}>
            {pending ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </AuthChrome>
  );
}

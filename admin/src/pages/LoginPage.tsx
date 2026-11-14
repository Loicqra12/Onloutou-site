import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isStaffRole, login, logout } from "../api";
import { CHALLENGE_KEY, LOGIN_HERO_SRC, SUPPORT_MAIL } from "../brand";
import { AuthChrome } from "../components/AuthChrome";
import { IconEye, IconEyeOff, IconLock, IconMail, IconShield } from "../components/Icons";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const res = await login(email, password);
    if (!res.ok) {
      setPending(false);
      setError(res.error);
      return;
    }
    if (res.data.twoFactorRequired && res.data.challengeToken) {
      sessionStorage.setItem(CHALLENGE_KEY, res.data.challengeToken);
      setPending(false);
      nav("/verification");
      return;
    }
    const user = res.data.user;
    if (!user || !isStaffRole(user.role)) {
      await logout();
      setPending(false);
      setError("Ce compte n’a pas accès à l’administration.");
      return;
    }
    sessionStorage.removeItem(CHALLENGE_KEY);
    setPending(false);
    nav("/");
  }

  return (
    <AuthChrome
      heroSrc={LOGIN_HERO_SRC}
      heroAlt="Entrepôt ONLOUTOU : bureau, réfrigérateur et matériel prêt à partir."
    >
      <div className="ag-card">
        <p className="ag-pill">
          <IconLock />
          Espace interne
        </p>
        <h2>Se connecter</h2>
        <p className="ag-lead">Utilisez votre compte professionnel ONLOUTOU.</p>
        <form className="ag-form" onSubmit={onSubmit}>
          <label htmlFor="adm-email">Adresse e-mail professionnelle</label>
          <div className="ag-field">
            <IconMail />
            <input
              id="adm-email"
              type="email"
              autoComplete="username"
              placeholder="prenom@onloutou.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <label htmlFor="adm-password">Mot de passe</label>
          <div className="ag-field">
            <IconLock />
            <input
              id="adm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="ag-field__extra"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          <p className="ag-forgot">
            <Link to="/mot-de-passe">Mot de passe oublié ?</Link>
          </p>
          {error ? (
            <p className="ag-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="ag-submit" disabled={pending}>
            {pending ? "Connexion…" : "Continuer"}
            {pending ? null : <span aria-hidden="true"> →</span>}
          </button>
        </form>
        <p className="ag-hint">
          <IconShield />
          Une vérification supplémentaire vous sera demandée.
        </p>
        <p className="ag-help">
          Vous n’avez pas d’accès ? <a href={SUPPORT_MAIL}>Contactez votre administrateur.</a>
        </p>
      </div>
    </AuthChrome>
  );
}

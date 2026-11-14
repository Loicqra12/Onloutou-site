import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isStaffRole, verifyTwoFactor } from "../api";
import { CHALLENGE_KEY, SUPPORT_MAIL, VERIFY_HERO_SRC } from "../brand";
import { AuthChrome } from "../components/AuthChrome";
import { IconDoc, IconGrid, IconLock, IconPerson, IconShield } from "../components/Icons";

function formatOtp(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function VerifyPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [challenge, setChallenge] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(CHALLENGE_KEY);
    if (!token) {
      nav("/login", { replace: true });
      return;
    }
    setChallenge(token);
  }, [nav]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!challenge) return;
    setPending(true);
    setError(null);
    const payload = mode === "totp" ? code.replace(/\s/g, "") : code.trim();
    const res = await verifyTwoFactor(challenge, payload);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (!res.data.user || !isStaffRole(res.data.user.role)) {
      setError("Ce compte n’a pas accès à l’administration.");
      return;
    }
    sessionStorage.removeItem(CHALLENGE_KEY);
    nav("/");
  }

  return (
    <AuthChrome
      heroSrc={VERIFY_HERO_SRC}
      heroAlt="Entrepôt ONLOUTOU à Abidjan : bureau, générateur et matériel en stock."
    >
      <div className="ag-card">
        <Link className="ag-back" to="/login">
          ← Retour à la connexion
        </Link>
        <div className="ag-id">
          <span className="ag-id__mark">
            <IconShield />
          </span>
          <div>
            <h2>Vérifiez votre identité</h2>
            <p className="ag-lead">
              {mode === "totp"
                ? "Saisissez le code à 6 chiffres de votre application d’authentification."
                : "Saisissez un code de secours. Chaque code ne peut servir qu’une fois."}
            </p>
          </div>
        </div>
        <form className="ag-form" onSubmit={onSubmit}>
          <label htmlFor="adm-otp">{mode === "totp" ? "Code de vérification" : "Code de secours"}</label>
          <div className="ag-field">
            {mode === "totp" ? <IconGrid /> : <IconDoc />}
            <input
              id="adm-otp"
              inputMode={mode === "totp" ? "numeric" : "text"}
              autoComplete="one-time-code"
              placeholder={mode === "totp" ? "000 000" : "XXXX-XXXX"}
              value={code}
              onChange={(e) => setCode(mode === "totp" ? formatOtp(e.target.value) : e.target.value.toUpperCase())}
              required
            />
          </div>
          {mode === "totp" ? <p className="ag-caption">Le code se renouvelle régulièrement.</p> : null}
          {error ? (
            <p className="ag-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="ag-submit" disabled={pending || !challenge}>
            {pending ? "Vérification…" : "Vérifier et accéder"}
          </button>
        </form>
        <div className="ag-alt">
          <p>Vous n’avez plus accès à votre application ?</p>
          <div className="ag-alt__row">
            <button
              type="button"
              className="ag-text-btn"
              onClick={() => {
                setMode((m) => (m === "totp" ? "backup" : "totp"));
                setCode("");
                setError(null);
              }}
            >
              <IconDoc />
              {mode === "totp" ? "Utiliser un code de secours" : "Utiliser l’application"}
            </button>
            <a className="ag-text-btn" href={SUPPORT_MAIL}>
              <IconPerson />
              Contacter l’administrateur
            </a>
          </div>
        </div>
        <p className="ag-protect">
          <IconLock />
          Cette étape protège l’accès à l’administration.
        </p>
      </div>
    </AuthChrome>
  );
}

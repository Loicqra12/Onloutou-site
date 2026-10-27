import Link from "next/link";
import { CookieInventoryTable } from "@/components/legal/CookieInventoryTable";
import { LegalSection } from "@/components/legal/LegalSection";
import {
  cookiesAuditBrowser,
  cookiesAuditEnvironment,
  cookiesAuditInteractions,
  cookiesAuditLimits,
  cookiesAuditRoutes,
  cookiesAuditStatusLabel,
  cookiesInventoryCounts,
  cookiesLastAuditedAt,
  cookiesLastUpdatedAt,
  cookiesProse,
  cookiesRequiresConsentManager,
  formatLegalDateFr,
  trackingStatus,
} from "@/content/cookies";

export function CookiesPolicyContent() {
  const counts = cookiesInventoryCounts();
  const needsConsent = cookiesRequiresConsentManager();

  return (
    <div className="leg-content">
      <LegalSection id="definition" title="Qu’est-ce qu’un cookie ?">
        <p>{cookiesProse.definitionIntro}</p>
      </LegalSection>

      <LegalSection id="audit" title="Résultat du dernier audit">
        <p className="leg-cookies-audit-status" role="status">
          Statut global : {cookiesAuditStatusLabel[trackingStatus]}
        </p>
        <dl className="leg-dl">
          <div className="leg-dl__row">
            <dt>Date de l’audit</dt>
            <dd>
              <time dateTime={cookiesLastAuditedAt}>{formatLegalDateFr(cookiesLastAuditedAt)}</time>
            </dd>
          </div>
          <div className="leg-dl__row">
            <dt>Environnement</dt>
            <dd>{cookiesAuditEnvironment}</dd>
          </div>
          <div className="leg-dl__row">
            <dt>Navigateur</dt>
            <dd>{cookiesAuditBrowser}</dd>
          </div>
          <div className="leg-dl__row">
            <dt>Technologies vérifiées</dt>
            <dd>{counts.verified}</dd>
          </div>
          <div className="leg-dl__row">
            <dt>À confirmer</dt>
            <dd>{counts.toConfirm}</dd>
          </div>
        </dl>
        <p>{cookiesProse.noneOnFirstLoad}</p>
        <p>L’audit porte sur le site public dans son état actuel. De nouvelles fonctions peuvent modifier cet inventaire.</p>
        <p className="leg-note">
          Routes vérifiées : {cookiesAuditRoutes.join(", ")}.
        </p>
        <p className="leg-note">Interactions testées : {cookiesAuditInteractions.join(" ; ")}.</p>
        <ul className="leg-list">
          {cookiesAuditLimits.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection id="technologies-utilisees" title="Technologies utilisées">
        <p>{cookiesProse.sessionStorageNote}</p>
        <CookieInventoryTable />
      </LegalSection>

      <LegalSection id="categories" title="Catégories">
        <h3 className="leg-privacy-cat__title">Strictement nécessaires</h3>
        <p>
          Stockages de session listés ci-dessus pour le fonctionnement des configurateurs (prefill entre pages). Aucune
          session d’authentification ni cookie de sécurité applicatif identifié dans le code audité.
        </p>
        <h3 className="leg-privacy-cat__title">Préférences</h3>
        <p>{cookiesProse.preferencesSection}</p>
        <h3 className="leg-privacy-cat__title">Mesure d’audience, médias externes, marketing</h3>
        <p>
          Aucun outil de ces catégories n’a été détecté dans le code source ni au chargement initial des routes auditées.
          {cookiesProse.noNonEssential}
        </p>
      </LegalSection>

      <LegalSection id="services-tiers" title="Services tiers">
        <p>{cookiesProse.whatsapp}</p>
        <p>{cookiesProse.fonts}</p>
        <p>
          Liens externes (WhatsApp, téléphone) : pas de chargement automatique du service tant que l’utilisateur n’active
          pas le lien. Aucune iframe, vidéo YouTube/Vimeo ou carte intégrée détectée dans le code.
        </p>
        <p className="leg-note">
          Voir aussi la{" "}
          <Link href="/confidentialite" className="link-motion">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection id="preferences" title="Préférences et consentement">
        <p>{cookiesProse.consentNotRequired}</p>
        {needsConsent ? (
          <p>Un gestionnaire de consentement serait requis si des traceurs non essentiels étaient activés.</p>
        ) : (
          <p>
            Aucun panneau « Gérer mes cookies » n’est affiché dans le footer tant qu’un consentement n’est pas requis
            par l’inventaire.
          </p>
        )}
        <noscript>
          <p className="leg-pending">
            Les préférences interactives de consentement nécessitent JavaScript. Sans traceur non essentiel identifié,
            le contenu essentiel du site reste accessible.
          </p>
        </noscript>
      </LegalSection>

      <LegalSection id="navigateurs" title="Réglages du navigateur">
        <p>{cookiesProse.browser}</p>
      </LegalSection>

      <LegalSection id="mise-a-jour" title="Mise à jour">
        <p>{cookiesProse.update}</p>
        <p>
          Dernière mise à jour de cette page :{" "}
          <time dateTime={cookiesLastUpdatedAt}>{formatLegalDateFr(cookiesLastUpdatedAt)}</time>
        </p>
        <p className="leg-note">
          Dernier audit technique :{" "}
          <time dateTime={cookiesLastAuditedAt}>{formatLegalDateFr(cookiesLastAuditedAt)}</time>
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>{cookiesProse.contact}</p>
        <p>
          <Link href="/contact" className="link-motion">Contacter ONLOUTOU</Link>
        </p>
        <p className="leg-note">
          <Link href="/mentions-legales" className="link-motion">Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite" className="link-motion">Confidentialité</Link>
        </p>
      </LegalSection>
    </div>
  );
}

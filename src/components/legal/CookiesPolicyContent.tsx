import Link from "next/link";
import { CookieInventoryTable } from "@/components/legal/CookieInventoryTable";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalSubArticle } from "@/components/legal/LegalSubArticle";
import { OpenCookieSettingsButton } from "@/components/legal/OpenCookieSettingsButton";
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
  formatLegalDateFr,
  trackingStatus,
} from "@/content/cookies";

export function CookiesPolicyContent() {
  const counts = cookiesInventoryCounts();

  return (
    <div>
      <LegalSection id="definition" number={1} title="Qu’est-ce qu’un cookie ?">
        <p>{cookiesProse.definitionIntro}</p>
        <LegalSubArticle id="definition-reels" number="1.1" title="Ce que le site utilise vraiment">
          <p>
            L’inventaire ne liste pas de cookie publicitaire, parce qu’aucun n’a été trouvé. Les technologies
            constatées sont le sessionStorage des formulaires, le localStorage du choix de bandeau, et, seulement
            après un clic, le lecteur YouTube d’une vidéo de la page À propos. Une autre vidéo est un fichier mp4
            du site, lu par le navigateur sans service vidéo tiers.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="audit" number={2} title="Résultat du dernier audit">
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

      <LegalSection id="technologies-utilisees" number={3} title="Technologies utilisées">
        <p>{cookiesProse.sessionStorageNote}</p>
        <CookieInventoryTable />
      </LegalSection>

      <LegalSection id="categories" number={4} title="Catégories">
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

      <LegalSection id="services-tiers" number={5} title="Services tiers">
        <p>{cookiesProse.whatsapp}</p>
        <p>{cookiesProse.fonts}</p>
        <p>
          Liens externes (WhatsApp, téléphone) : pas de chargement automatique du service tant que l’utilisateur
          n’active pas le lien. La vidéo YouTube de la page À propos utilise une intégration qui ne charge
          youtube-nocookie qu’au clic. Avant ce clic, le lecteur tiers n’est pas demandé. Après le clic, YouTube
          peut déposer ses propres traceurs selon ses règles. La vidéo locale en mp4 ne déclenche pas ce chargement.
          Aucune carte intégrée n’a été détectée.
        </p>
        <p className="leg-note">
          Voir aussi la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection id="preferences" number={6} title="Préférences et consentement">
        <p>{cookiesProse.consentNotRequired}</p>
        <p>
          Le bouton ci-dessous, comme celui du pied de page, rouvre les réglages. Aucun outil de mesure ou de publicité
          n’est activé par ce choix dans la version actuelle du site.
        </p>
        <OpenCookieSettingsButton />
        <LegalSubArticle id="consequences" number="6.1" title="Conséquences d’un refus">
          <p>
            Choisir « Uniquement les nécessaires » enregistre ce choix et laisse le site lisible. Les formulaires,
            le téléphone et WhatsApp restent utilisables. Aucune mesure d’audience n’est perdue, puisqu’aucun outil
            de mesure n’est branché. Refuser JavaScript empêche le bandeau, pas la lecture des pages.
          </p>
          <p>
            Pour retirer un choix déjà enregistré, la personne efface les données du site dans son navigateur, ou
            rouvre ce bouton et enregistre un autre choix. Le retrait n’efface pas un message déjà envoyé sur
            WhatsApp.
          </p>
        </LegalSubArticle>
        <noscript>
          <p className="leg-pending">
            Les préférences interactives de consentement nécessitent JavaScript. Sans traceur non essentiel identifié,
            le contenu essentiel du site reste accessible.
          </p>
        </noscript>
      </LegalSection>

      <LegalSection id="navigateurs" number={7} title="Réglages du navigateur">
        <p>{cookiesProse.browser}</p>
      </LegalSection>

      <LegalSection id="mise-a-jour" number={8} title="Mise à jour">
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

      <LegalSection id="contact" number={9} title="Contact">
        <p>{cookiesProse.contact}</p>
        <p>
          <Link href="/contact">Contacter ONLOUTOU</Link>
        </p>
        <p className="leg-note">
          <Link href="/mentions-legales">Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite">Confidentialité</Link>
        </p>
      </LegalSection>
    </div>
  );
}

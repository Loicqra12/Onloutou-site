import Link from "next/link";
import { LegalMissingInformationNotice } from "@/components/legal/LegalMissingInformationNotice";
import { LegalSection } from "@/components/legal/LegalSection";
import { PrivacyDataCategory } from "@/components/legal/PrivacyDataCategory";
import { PrivacyProcessingTable } from "@/components/legal/PrivacyProcessingTable";
import { PrivacyThirdPartyTable } from "@/components/legal/PrivacyThirdPartyTable";
import {
  formatLegalDateFr,
  privacyDataCategories,
  privacyPolicyLastUpdated,
  privacyProse,
  privacyPurposes,
  privacyResponsibleVerifiedFields,
  trackingStatus,
} from "@/content/privacy";
import { site } from "@/content/site";

const trackingLabel: Record<string, string> = {
  "none-detected": "Aucun traceur non essentiel détecté dans le code",
  "essential-only": "Technologies essentielles uniquement (selon audit)",
  "non-essential": "Traceurs non essentiels identifiés",
  "to-confirm": "Audit incomplet — cookies hébergeur ou CDN à confirmer en production",
};

export function PrivacyPolicyContent() {
  const responsibleRows = privacyResponsibleVerifiedFields();

  return (
    <div className="leg-content">
      <LegalSection id="responsable" title="Responsable du traitement">
        {responsibleRows.length > 0 ? (
          <dl className="leg-dl">
            {responsibleRows.map((row) => (
              <div key={row.label} className="leg-dl__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <LegalMissingInformationNotice>
          L’identité juridique complète du responsable de traitement (raison sociale, siège, etc.) n’est pas encore
          publiée. Seules les informations confirmées dans les mentions légales sont reproduites ici.
        </LegalMissingInformationNotice>
        <p className="leg-note">
          Voir aussi les{" "}
          <Link href="/mentions-legales" className="link-motion">mentions légales</Link>.
        </p>
      </LegalSection>

      <LegalSection id="champ-application" title="Champ d’application">
        <p>{privacyProse.scope}</p>
        <p>{privacyProse.portalPreview}</p>
        <p>{privacyProse.noServerForms}</p>
      </LegalSection>

      <LegalSection id="donnees-traitees" title="Données traitées">
        <p>Seules les catégories ci-dessous ont été identifiées lors de l’audit technique du site.</p>
        {privacyDataCategories.map((category) => (
          <PrivacyDataCategory key={category.title} category={category} />
        ))}
        <PrivacyProcessingTable />
      </LegalSection>

      <LegalSection id="finalites" title="Finalités">
        <ul className="leg-list">
          {privacyPurposes.map((purpose) => (
            <li key={purpose.label}>
              {purpose.label}
              {purpose.status === "to-confirm" ? (
                <span className="leg-note"> (à confirmer selon hébergement)</span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="leg-note">
          Fondements juridiques de chaque traitement actif : à valider juridiquement avant publication définitive.
        </p>
      </LegalSection>

      <LegalSection id="formulaires-whatsapp" title="Formulaires et WhatsApp">
        <p>{privacyProse.whatsappForms}</p>
        <p>
          Parcours concernés (audit code) : demandes produits, livraison, équipements (outils, connectés, etc.),
          candidatures partenaire et livreur, ainsi que les raccourcis contact et centre d’aide.
        </p>
      </LegalSection>

      <LegalSection id="services-tiers" title="Services tiers">
        <PrivacyThirdPartyTable />
      </LegalSection>

      <LegalSection id="cookies" title="Cookies et stockage local">
        <p>
          {privacyProse.cookiesIntro}{" "}
          <Link href="/cookies" className="link-motion">Politique relative aux cookies</Link>.
        </p>
        <p>Statut de l’audit traceurs : {trackingLabel[trackingStatus] ?? trackingStatus}.</p>
        <p className="leg-note">
          Clés <code className="leg-code">sessionStorage</code> utilisées pour le préremplissage : préfixe{" "}
          <code className="leg-code">onloutou-</code> (produits, familles d’outils, modes, actifs connectés). Aucun{" "}
          <code className="leg-code">localStorage</code> identifié dans le code source audité.
        </p>
      </LegalSection>

      <LegalSection id="durees" title="Durées de conservation">
        <LegalMissingInformationNotice>{privacyProse.retentionPending}</LegalMissingInformationNotice>
      </LegalSection>

      <LegalSection id="destinataires" title="Destinataires">
        <ul className="leg-list">
          <li>Personnes habilitées chez ONLOUTOU pour traiter les demandes reçues (WhatsApp, téléphone).</li>
          <li>WhatsApp / Meta lorsque vous utilisez le service pour envoyer un message préparé sur le site.</li>
          <li>Hébergeur du site — identité et cadre contractuel à confirmer.</li>
        </ul>
        <p className="leg-note">Aucun partage avec des « partenaires commerciaux » génériques n’a été identifié dans le code actuel.</p>
      </LegalSection>

      <LegalSection id="transferts" title="Transferts hors du pays">
        <LegalMissingInformationNotice>{privacyProse.transfersPending}</LegalMissingInformationNotice>
      </LegalSection>

      <LegalSection id="securite" title="Sécurité">
        <p>{privacyProse.security}</p>
        <ul className="leg-list">
          <li>Limitation des données : pas d’API de formulaire serveur identifiée pour les configurateurs audités.</li>
          <li>Secrets et configuration : variables d’environnement attendues pour l’URL publique du site.</li>
          <li>Dépendances : pile Next.js / React maintenue dans le dépôt (voir audit npm).</li>
        </ul>
      </LegalSection>

      <LegalSection id="droits" title="Droits des personnes">
        <p>{privacyProse.rightsIntro}</p>
        <p>{privacyProse.rightsContact}</p>
        <p>
          Canal de contact :{" "}
          <Link href="/contact" className="link-motion">page Contact</Link>
          {site.phoneDisplay ? (
            <>
              {" "}
              ou téléphone{" "}
              <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
            </>
          ) : null}
          . Aucune adresse e-mail dédiée « confidentialité » n’est publiée tant qu’elle n’est pas validée.
        </p>
      </LegalSection>

      <LegalSection id="mineurs" title="Mineurs">
        <p>{privacyProse.minors}</p>
      </LegalSection>

      <LegalSection id="modifications" title="Modifications">
        <p>{privacyProse.changes}</p>
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={privacyPolicyLastUpdated}>{formatLegalDateFr(privacyPolicyLastUpdated)}</time>
        </p>
      </LegalSection>

      <LegalSection id="contact-confidentialite" title="Contact confidentialité">
        <p>{privacyProse.rightsContact}</p>
        <p>
          <Link href="/contact" className="link-motion">Contacter ONLOUTOU</Link>
        </p>
      </LegalSection>
    </div>
  );
}

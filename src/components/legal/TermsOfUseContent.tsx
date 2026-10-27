import Link from "next/link";
import { LegalMissingInformationNotice } from "@/components/legal/LegalMissingInformationNotice";
import { LegalRelatedDocuments } from "@/components/legal/LegalRelatedDocuments";
import { LegalSection } from "@/components/legal/LegalSection";
import {
  formatLegalDateFr,
  legalProse,
  legalRelatedDocumentLinks,
  termsOfUseLastUpdated,
  termsOfUseProse,
} from "@/content/legal";

export function TermsOfUseContent() {
  return (
    <div className="leg-content">
      <LegalRelatedDocuments
        links={[...legalRelatedDocumentLinks]}
        currentPath="/conditions-utilisation"
      />

      <LegalSection id="objet" title="Objet du site">
        <p>{termsOfUseProse.object}</p>
      </LegalSection>

      <LegalSection id="acces" title="Accès au site">
        <p>{termsOfUseProse.access}</p>
      </LegalSection>

      <LegalSection id="informations" title="Informations présentées">
        <p>{termsOfUseProse.information}</p>
        <p className="leg-note">{legalProse.siteUse}</p>
      </LegalSection>

      <LegalSection id="fonctions-preparation" title="Fonctions en préparation">
        <p>{termsOfUseProse.planned}</p>
      </LegalSection>

      <LegalSection id="demandes-contact" title="Demandes et prises de contact">
        <p>{termsOfUseProse.contactRequests}</p>
        <p>
          <Link href="/contact" className="link-motion">Page contact</Link>
        </p>
      </LegalSection>

      <LegalSection id="utilisations-interdites" title="Utilisations interdites">
        <p>{termsOfUseProse.prohibited}</p>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" title="Propriété intellectuelle">
        <p>{legalProse.intellectualProperty}</p>
      </LegalSection>

      <LegalSection id="liens-externes" title="Liens externes">
        <p>{legalProse.externalLinks}</p>
      </LegalSection>

      <LegalSection id="disponibilite" title="Disponibilité et évolution">
        <p>
          ONLOUTOU peut modifier, suspendre ou interrompre l’accès au site pour maintenance, mise à jour ou
          raison technique. Le site peut évoluer sans préavis ; les contenus peuvent être mis à jour ou retirés.
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" title="Responsabilité">
        <p>{legalProse.liability}</p>
      </LegalSection>

      <LegalSection id="donnees-cookies" title="Données personnelles et cookies">
        <p>
          {legalProse.personalData}{" "}
          <Link href="/confidentialite" className="link-motion">Politique de confidentialité</Link>.
        </p>
        <p>
          {legalProse.cookies}{" "}
          <Link href="/cookies" className="link-motion">Politique relative aux cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection id="conditions-commerciales" title="Conditions commerciales séparées">
        <p>{termsOfUseProse.commercial}</p>
      </LegalSection>

      <LegalSection id="espaces-partenaire-livreur" title="Espaces partenaire et livreur">
        <p>{termsOfUseProse.portals}</p>
        <p className="leg-note">
          <Link href="/espace-partenaire" className="link-motion">Espace partenaire (aperçu)</Link>
          {" · "}
          <Link href="/espace-livreur" className="link-motion">Espace livreur (aperçu)</Link>
        </p>
      </LegalSection>

      <LegalSection id="modification" title="Modification des conditions">
        <p>{termsOfUseProse.changes}</p>
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={termsOfUseLastUpdated}>{formatLegalDateFr(termsOfUseLastUpdated)}</time>
        </p>
      </LegalSection>

      <LegalSection id="droit-applicable" title="Droit applicable">
        <LegalMissingInformationNotice>{legalProse.applicableLawPending}</LegalMissingInformationNotice>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>{termsOfUseProse.contact}</p>
        <p>
          <Link href="/contact" className="link-motion">Contacter ONLOUTOU</Link>
          {" · "}
          <Link href="/mentions-legales" className="link-motion">Mentions légales</Link>
        </p>
      </LegalSection>
    </div>
  );
}

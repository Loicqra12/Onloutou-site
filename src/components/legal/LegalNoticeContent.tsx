import Link from "next/link";
import { LegalMissingInformationNotice } from "@/components/legal/LegalMissingInformationNotice";
import { LegalSection } from "@/components/legal/LegalSection";
import {
  formatLegalDateFr,
  hostingInformation,
  legalEntityInformation,
  legalNoticeLastUpdated,
  legalProse,
  verifiedLegalFields,
} from "@/content/legal";
import { site } from "@/content/site";

const editorKeys = [
  "commercialName",
  "legalName",
  "legalForm",
  "capital",
  "registryNumber",
  "taxNumber",
  "registeredOffice",
  "legalRepresentative",
] as const;

export function LegalNoticeContent() {
  const editorRows = verifiedLegalFields(legalEntityInformation, [...editorKeys]);

  return (
    <div className="leg-content">
      <LegalSection id="editeur" title="Éditeur du site">
        {editorRows.length > 0 ? (
          <dl className="leg-dl">
            {editorRows.map((row) => (
              <div key={row.key} className="leg-dl__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <LegalMissingInformationNotice>
          Les identifications légales complètes de l’éditeur (raison sociale, immatriculation, siège, etc.) ne sont
          pas encore publiées sur cette page.
        </LegalMissingInformationNotice>
      </LegalSection>

      <LegalSection id="coordonnees" title="Coordonnées">
        <dl className="leg-dl">
          <div className="leg-dl__row">
            <dt>Téléphone</dt>
            <dd>
              <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
            </dd>
          </div>
          <div className="leg-dl__row">
            <dt>WhatsApp</dt>
            <dd>
              <a href={site.whatsappUrl} rel="noopener noreferrer" target="_blank">
                Contacter via WhatsApp
              </a>
            </dd>
          </div>
          <div className="leg-dl__row">
            <dt>Localisation indiquée</dt>
            <dd>{site.location}</dd>
          </div>
        </dl>
        <p className="leg-note">
          Cette localisation ne constitue pas une adresse postale du siège social. Pour une prise de contact, utilisez
          la page{" "}
          <Link href="/contact" className="link-motion">Contact</Link>.
        </p>
        {legalEntityInformation.publicEmail.status !== "verified" ? (
          <p className="leg-note">Aucune adresse e-mail officielle n’est publiée sur cette page pour le moment.</p>
        ) : null}
      </LegalSection>

      <LegalSection id="publication" title="Direction de la publication">
        {legalEntityInformation.publicationDirector.status === "verified" &&
        legalEntityInformation.publicationDirector.value ? (
          <p>{legalEntityInformation.publicationDirector.value}</p>
        ) : (
          <LegalMissingInformationNotice>{legalProse.publicationPending}</LegalMissingInformationNotice>
        )}
      </LegalSection>

      <LegalSection id="hebergement" title="Hébergement">
        {hostingInformation.providerName.status === "verified" && hostingInformation.providerName.value ? (
          <dl className="leg-dl">
            {(["providerName", "legalName", "address", "website", "phone"] as const).map((key) => {
              const field = hostingInformation[key];
              if (field.status !== "verified" || !field.value) return null;
              const labels: Record<string, string> = {
                providerName: "Hébergeur",
                legalName: "Raison sociale",
                address: "Adresse",
                website: "Site web",
                phone: "Contact",
              };
              return (
                <div key={key} className="leg-dl__row">
                  <dt>{labels[key]}</dt>
                  <dd>{field.value}</dd>
                </div>
              );
            })}
          </dl>
        ) : (
          <LegalMissingInformationNotice>{legalProse.hostingPending}</LegalMissingInformationNotice>
        )}
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" title="Propriété intellectuelle">
        <p>{legalProse.intellectualProperty}</p>
      </LegalSection>

      <LegalSection id="utilisation" title="Utilisation du site">
        <p>{legalProse.siteUse}</p>
      </LegalSection>

      <LegalSection id="responsabilite" title="Limitation de responsabilité">
        <p>{legalProse.liability}</p>
      </LegalSection>

      <LegalSection id="liens-externes" title="Liens vers des sites tiers">
        <p>{legalProse.externalLinks}</p>
      </LegalSection>

      <LegalSection id="donnees-personnelles" title="Données personnelles">
        <p>
          {legalProse.personalData}{" "}
          <Link href="/confidentialite" className="link-motion">Politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies et technologies similaires">
        <p>
          {legalProse.cookies}{" "}
          <Link href="/cookies" className="link-motion">Politique relative aux cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection id="droit-applicable" title="Droit applicable">
        <LegalMissingInformationNotice>{legalProse.applicableLawPending}</LegalMissingInformationNotice>
      </LegalSection>

      <LegalSection id="mise-a-jour" title="Mise à jour du document">
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={legalNoticeLastUpdated}>{formatLegalDateFr(legalNoticeLastUpdated)}</time>
        </p>
      </LegalSection>
    </div>
  );
}

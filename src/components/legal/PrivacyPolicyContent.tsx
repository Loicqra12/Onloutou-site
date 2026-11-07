import Link from "next/link";
import { LegalMissingInformationNotice } from "@/components/legal/LegalMissingInformationNotice";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalSubArticle } from "@/components/legal/LegalSubArticle";
import { PrivacyDataCategory } from "@/components/legal/PrivacyDataCategory";
import { PrivacyProcessingTable } from "@/components/legal/PrivacyProcessingTable";
import { PrivacyThirdPartyTable } from "@/components/legal/PrivacyThirdPartyTable";
import { legalEntityInformation } from "@/content/legal";
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
    <div>
      <LegalSection id="responsable" number={1} title="Responsable du traitement et périmètre">
        <p>
          Cette politique concerne les données des personnes qui visitent le site public ou envoient une demande
          depuis ce site. Pour ces traitements, le responsable est la société identifiée ci-dessous.
        </p>
        {responsibleRows.length > 0 ? (
          <dl className="leg-dl">
            {responsibleRows.map((row) => (
              <div key={row.label} className="leg-dl__row">
                <dt>{row.label}</dt>
                <dd>
                  {row.label === "Téléphone" ? <a href={`tel:${site.phoneTel}`}>{row.value}</a> : row.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <LegalSubArticle id="responsable-formalite" number="1.1" title="Formalité auprès de l’autorité">
          <p>
            La loi n° 2013-450 du 19 juin 2013 soumet en principe un traitement de données à une déclaration préalable
            auprès de l’Autorité de protection, et certains traitements — notamment un transfert vers un pays
            étranger — à une autorisation. ONLOUTOU n’a pas communiqué, pour cette version, de récépissé de
            déclaration ni de décision d’autorisation. Cette politique décrit les faits. Elle ne prouve pas que la
            formalité a été accomplie. Ce point reste à régulariser avant de présenter le dispositif comme complet.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="responsable-gps" number="1.2" title="Site public et prestation GPS">
          <p>
            Le site ne reçoit pas les positions des véhicules ou des objets des clients. Une prestation de
            géolocalisation, si elle est plus tard conclue par contrat, pourra traiter des positions, des
            identifiants de boîtiers et des comptes d’accès. Dans ce contrat, ONLOUTOU pourra être responsable du
            traitement de son propre service, ou agir pour le compte du client professionnel qui équipe sa flotte.
            Cette seconde qualité n’est pas exercée par la simple visite du site, et aucune position n’est collectée
            ici. Les pièces d’identité ne sont pas demandées par les formulaires publics.
          </p>
        </LegalSubArticle>
        <p>
          Identité complète : <Link href="/mentions-legales">mentions légales</Link>. Aucune adresse e-mail dédiée à
          la confidentialité n’est publiée
          {legalEntityInformation.publicEmail.status !== "verified" ? ", faute de confirmation." : "."}
        </p>
      </LegalSection>

      <LegalSection id="champ-application" number={2} title="Personnes concernées et champ">
        <p>{privacyProse.scope}</p>
        <LegalSubArticle id="personnes" number="2.1" title="Personnes concernées">
          <p>
            Sont concernées les personnes qui consultent le site, celles qui téléphonent, et celles qui envoient un
            message préparé par un formulaire. Si le message parle d’un tiers, par exemple un conducteur ou un
            contact sur site, l’expéditeur doit être en mesure de transmettre cette information. Le site ne crée pas
            de fichier clients, partenaires ou livreurs.
          </p>
        </LegalSubArticle>
        <p>{privacyProse.portalPreview}</p>
        <p>{privacyProse.noServerForms}</p>
      </LegalSection>

      <LegalSection id="donnees-traitees" number={3} title="Données traitées et sources">
        <p>
          Seules les catégories ci-dessous ont été identifiées. Une information est obligatoire seulement si, sans
          elle, ONLOUTOU ne peut pas répondre : en pratique un moyen de contact et l’objet de la demande. Le reste
          des champs est facultatif. Refuser un champ facultatif limite la précision de la réponse. Refuser
          d’envoyer le message empêche simplement l’échange. La visite des pages reste possible.
        </p>
        {privacyDataCategories.map((category) => (
          <PrivacyDataCategory key={category.title} category={category} />
        ))}
        <LegalSubArticle id="sources-donnees" number="3.1" title="Sources">
          <ul className="leg-list">
            <li>la saisie de l’utilisateur dans son navigateur ;</li>
            <li>le message qu’il envoie ensuite sur WhatsApp, ou l’appel qu’il passe ;</li>
            <li>le sessionStorage, lorsque l’utilisateur a choisi une famille ou un mode sur une page précédente ;</li>
            <li>les journaux de l’hébergeur, dont l’existence précise reste à confirmer en production.</li>
          </ul>
          <p>Le site ne récupère pas de données auprès d’un courtier, d’un réseau social ou d’un fichier public.</p>
        </LegalSubArticle>
        <PrivacyProcessingTable />
      </LegalSection>

      <LegalSection id="finalites" number={4} title="Finalités et fondements">
        <p>
          La loi ivoirienne exige une finalité déterminée et une information préalable. Elle ne reprend pas le
          tableau des bases du règlement européen. Pour chaque traitement du site, la qualification retenue dans
          cette rédaction est indiquée. Elle devra être reprise dans la formalité auprès de l’Autorité. La visite du
          site n’est pas utilisée pour constituer un fichier de prospection.
        </p>
        <ul className="leg-list">
          {privacyPurposes.map((purpose) => (
            <li key={purpose.label}>
              {purpose.label}
              {purpose.status === "to-confirm" ? <span> — à confirmer selon l’hébergement réel.</span> : null}
            </li>
          ))}
        </ul>
        <LegalSubArticle id="fondements" number="4.1" title="Qualification retenue">
          <ul className="leg-list">
            <li>
              Répondre à une demande envoyée par la personne : la personne prend l’initiative de l’échange en vue
              d’une prestation. C’est le fondement décrit ici. Il reste à faire figurer dans la déclaration.
            </li>
            <li>
              Mémoriser un choix de formulaire dans l’onglet : fonctionnement demandé par la navigation de la
              personne, limité à sa session.
            </li>
            <li>
              Journaux techniques : intérêt du fonctionnement et de la sécurité du site, seulement si l’hébergeur
              les produit. Non confirmé.
            </li>
            <li>
              Choix du bandeau cookies : préférence enregistrée par la personne, sans mesure d’audience associée.
            </li>
          </ul>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="formulaires-whatsapp" number={5} title="Formulaires et WhatsApp">
        <p>{privacyProse.whatsappForms}</p>
        <p>
          Parcours concernés : demandes produits, livraison, équipements, outils, matériels connectés, candidatures
          partenaire et livreur, raccourcis du contact et du centre d’aide. Après l’envoi, WhatsApp et l’opérateur
          deviennent destinataires de ce que l’utilisateur transmet. ONLOUTOU ne reçoit pas une copie parallèle sur
          un serveur identifié dans le code.
        </p>
        <p>
          Conséquence d’un refus : la personne peut toujours téléphoner. Elle ne peut pas exiger qu’un formulaire
          aboutisse sans ouvrir le canal d’envoi.
        </p>
      </LegalSection>

      <LegalSection id="services-tiers" number={6} title="Prestataires réellement utilisés">
        <p>
          Les prestataires ci-dessous correspondent au code et aux liens du site. Aucun outil de paiement, de
          signature ou de carte n’est branché.
        </p>
        <PrivacyThirdPartyTable />
      </LegalSection>

      <LegalSection id="cookies" number={7} title="Cookies et stockage local">
        <p>
          {privacyProse.cookiesIntro} <Link href="/cookies">Politique relative aux cookies</Link>.
        </p>
        <p>Statut de l’audit traceurs : {trackingLabel[trackingStatus] ?? trackingStatus}.</p>
        <p>
          Le choix du bandeau est enregistré dans <code className="leg-code">localStorage</code>, clé{" "}
          <code className="leg-code">onloutou-cookie-choice</code>. Les préremplissages utilisent{" "}
          <code className="leg-code">sessionStorage</code>, préfixe <code className="leg-code">onloutou-</code>. Une
          vidéo YouTube n’est chargée qu’après un clic sur la page À propos. La vidéo lue depuis un fichier du site
          ne passe pas par ce service.
        </p>
      </LegalSection>

      <LegalSection id="durees" number={8} title="Durées, archivage et suppression">
        <LegalMissingInformationNotice>{privacyProse.retentionPending}</LegalMissingInformationNotice>
        <LegalSubArticle id="criteres" number="8.1" title="Critères déjà connaissables">
          <ul className="leg-list">
            <li>sessionStorage : jusqu’à la fermeture de l’onglet ou la reprise du formulaire ;</li>
            <li>choix cookies : jusqu’à l’effacement par la personne ou par son navigateur ;</li>
            <li>
              message WhatsApp : conservé dans la messagerie des personnes qui participent à la conversation, selon
              WhatsApp, et non dans une base ONLOUTOU identifiée ;
            </li>
            <li>
              dossier d’une prestation ultérieure : durée non arrêtée. Elle devra couvrir le temps du contrat et les
              délais de conservation comptable ou probatoire applicables, qui ne sont pas fixés dans cette page.
            </li>
          </ul>
          <p>
            Supprimer le choix cookies se fait dans le navigateur ou en effaçant la clé. Supprimer un message déjà
            envoyé sur WhatsApp se fait dans WhatsApp. ONLOUTOU ne peut pas l’effacer à distance. Aucune sauvegarde
            serveur des formulaires n’a été identifiée ; il n’y a donc pas, pour ces formulaires, d’archive à
            purger côté site.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="destinataires" number={9} title="Destinataires">
        <ul className="leg-list">
          <li>Les personnes d’ONLOUTOU qui lisent le téléphone ou WhatsApp pour répondre à la demande.</li>
          <li>WhatsApp / Meta, lorsque l’utilisateur envoie le message.</li>
          <li>L’opérateur téléphonique, lorsque l’utilisateur appelle.</li>
          <li>L’hébergeur du site, dont l’identité reste à confirmer, pour les journaux techniques éventuels.</li>
          <li>YouTube, seulement si l’utilisateur lance la vidéo concernée.</li>
        </ul>
        <p>
          Aucun partage avec un fichier de partenaires commerciaux n’est prévu par le code. Un partenaire n’est
          saisi d’un besoin que si ONLOUTOU décide, dans l’échange humain, de le solliciter pour établir une
          proposition, et dans la limite des informations utiles à cette proposition.
        </p>
      </LegalSection>

      <LegalSection id="transferts" number={10} title="Transferts hors de Côte d’Ivoire">
        <LegalMissingInformationNotice>{privacyProse.transfersPending}</LegalMissingInformationNotice>
        <p>
          Le transfert identifiable aujourd’hui est celui que l’utilisateur déclenche en ouvrant WhatsApp ou YouTube.
          Ces services peuvent traiter des données dans plusieurs pays. Le pays exact, les garanties et l’autorisation
          de transfert prévue par la loi 2013-450 ne sont pas documentés dans le dépôt. Ils font partie de la
          formalité restant à accomplir. Le sessionStorage, lui, reste sur l’appareil de la personne.
        </p>
      </LegalSection>

      <LegalSection id="securite" number={11} title="Sécurité">
        <p>{privacyProse.security}</p>
        <ul className="leg-list">
          <li>Pas d’API de formulaire identifiée pour les configurateurs audités.</li>
          <li>Pas de compte, donc pas de mot de passe à protéger sur le site.</li>
          <li>Les canaux WhatsApp et téléphone ne sont pas présentés comme un moyen d’envoyer des pièces sensibles.</li>
        </ul>
        <p>
          Ces mesures réduisent la quantité de données. Elles ne promettent pas une sécurité absolue, ni que le
          téléphone de l’utilisateur ou WhatsApp soient exempts d’incident.
        </p>
      </LegalSection>

      <LegalSection id="droits" number={12} title="Droits des personnes">
        <p>
          L’Autorité de protection décrit, au titre de la loi n° 2013-450, les droits d’information, d’opposition,
          d’interrogation, d’accès, de rectification et à l’oubli. La personne peut les exercer pour les données
          qu’ONLOUTOU détient réellement. Pour un message qui n’est que dans WhatsApp, l’exercice se fait aussi
          auprès de ce service.
        </p>
        <LegalSubArticle id="exercice" number="12.1" title="Comment les exercer">
          <ol className="leg-ol">
            <li>
              Écrire via la <Link href="/contact">page contact</Link> ou appeler le{" "}
              <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>, en indiquant « données personnelles » et le
              droit utilisé.
            </li>
            <li>
              Préciser le canal de la demande d’origine, par exemple le prénom utilisé sur WhatsApp, sans renvoyer
              une pièce d’identité complète, un mot de passe ou un relevé bancaire.
            </li>
            <li>
              ONLOUTOU peut demander un élément proportionné pour éviter de répondre à la mauvaise personne, par
              exemple de réécrire depuis le même numéro. Elle ne constitue pas un dossier d’identité pour cela.
            </li>
            <li>
              Elle répond lorsqu’elle peut identifier les données. Les textes consultés de l’Autorité renvoient au
              délai prévu par le législateur sans qu’un nombre de jours unique, applicable à la réponse au demandeur,
              ait été isolé dans les extraits vérifiés. Le délai d’un mois mentionné pour l’Autorité concerne sa
              décision sur une déclaration ou une autorisation, et n’est pas recopié ici comme délai de réponse
              d’ONLOUTOU.
            </li>
          </ol>
        </LegalSubArticle>
        <LegalSubArticle id="recours" number="12.2" title="Recours">
          <p>
            Si la personne estime que sa demande n’est pas traitée, elle peut saisir l’Autorité de protection des
            données à caractère personnel, autoritedeprotection.ci, qui est l’autorité désignée pour la loi de 2013.
            Elle peut aussi saisir la juridiction compétente. Cette politique n’indique pas de médiateur privé.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="mineurs" number={13} title="Mineurs">
        <p>{privacyProse.minors}</p>
      </LegalSection>

      <LegalSection id="modifications" number={14} title="Modifications">
        <p>{privacyProse.changes}</p>
        <p>
          La date affichée en tête de page est celle de la rédaction. Les personnes qui n’ont pas de compte ne
          reçoivent pas d’avis individuel. Une prestation GPS ouverte plus tard donnera lieu à une information propre
          avant la collecte des positions.
        </p>
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={privacyPolicyLastUpdated}>{formatLegalDateFr(privacyPolicyLastUpdated)}</time>
        </p>
      </LegalSection>

      <LegalSection id="contact-confidentialite" number={15} title="Contact confidentialité">
        <p>{privacyProse.rightsContact}</p>
        <p>
          <Link href="/contact">Contacter ONLOUTOU</Link>
          {" ou appeler "}
          <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>.
        </p>
      </LegalSection>
    </div>
  );
}

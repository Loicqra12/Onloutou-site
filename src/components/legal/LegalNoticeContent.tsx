import Link from "next/link";
import { LegalMissingInformationNotice } from "@/components/legal/LegalMissingInformationNotice";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalSubArticle } from "@/components/legal/LegalSubArticle";
import {
  formatLegalDateFr,
  legalEntityInformation,
  legalNoticeLastUpdated,
  legalPracticalLandmark,
  legalProse,
} from "@/content/legal";
import { site } from "@/content/site";

export function LegalNoticeContent() {
  const director = legalEntityInformation.publicationDirector.value;

  return (
    <div>
      <LegalSection id="editeur" number={1} title="Identité de l’éditeur">
        <p>
          Le site public ONLOUTOU est édité par la société identifiée ci-dessous. Ces éléments ont été communiqués
          par le propriétaire de l’entreprise le 5 novembre 2026. Ils décrivent l’éditeur. Ils ne remplacent pas un
          extrait du registre du commerce et du crédit mobilier, qui n’est pas reproduit dans cette version.
        </p>
        <div className="leg-identity">
          <dl className="leg-dl">
            <div className="leg-dl__row">
              <dt>Dénomination</dt>
              <dd>ONLOUTOU</dd>
            </div>
            <div className="leg-dl__row">
              <dt>Forme juridique</dt>
              <dd>Société à responsabilité limitée unipersonnelle — SARLU</dd>
            </div>
            <div className="leg-dl__row">
              <dt>Capital social</dt>
              <dd>3&nbsp;000&nbsp;000&nbsp;FCFA</dd>
            </div>
            <div className="leg-dl__row">
              <dt>Siège social</dt>
              <dd>Abidjan, Riviera Bonoumin, lot 25, îlot 18, Côte d’Ivoire</dd>
            </div>
            <div className="leg-dl__row">
              <dt>RCCM</dt>
              <dd>CI-ABJ-2016-A-3617</dd>
            </div>
            <div className="leg-dl__row">
              <dt>Compte contribuable</dt>
              <dd>1541839S</dd>
            </div>
            <div className="leg-dl__row">
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
              </dd>
            </div>
            <div className="leg-dl__row">
              <dt>Responsable de la publication</dt>
              <dd>{director}</dd>
            </div>
          </dl>
        </div>
        <LegalSubArticle id="editeur-portee" number="1.1" title="Ce que cette fiche permet">
          <p>
            La dénomination, la forme, le capital, le siège, le numéro RCCM et le compte contribuable permettent
            d’identifier la personne morale qui édite le site. Aucune raison sociale distincte du nom ONLOUTOU n’a
            été communiquée. Le représentant légal, au sens du gérant habilité à engager la société, n’est pas déduit
            du responsable de la publication et n’est donc pas indiqué.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="coordonnees" number={2} title="Siège et coordonnées">
        <LegalSubArticle id="siege" number="2.1" title="Siège social">
          <p>
            L’adresse du siège est : Abidjan, Riviera Bonoumin, lot 25, îlot 18, Côte d’Ivoire. C’est l’adresse
            juridique communiquée pour l’éditeur. Les mentions « Abidjan, Côte d’Ivoire » qui figurent dans le bandeau,
            le pied de page ou la page contact sont des repères géographiques courts. Elles ne remplacent pas le siège.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="repere" number="2.2" title="Repère d’accès">
          <p>
            Un repère pratique a été communiqué, distinct du siège : {legalPracticalLandmark}. Il aide à situer un
            lieu. Il ne constitue pas l’adresse du siège et ne doit pas être utilisé comme seule adresse dans un acte.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="canaux" number="2.3" title="Canaux pour joindre l’éditeur">
          <p>Pour une question sur le site, une demande ou une réclamation, les canaux ouverts aujourd’hui sont :</p>
          <ul className="leg-list">
            <li>
              le téléphone <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a> ;
            </li>
            <li>
              WhatsApp, par les liens <code className="leg-code">wa.me</code> du site, qui ouvrent une conversation
              vers le numéro de l’entreprise après une action de l’utilisateur ;
            </li>
            <li>
              la <Link href="/contact">page contact</Link>, dont le formulaire prépare un message WhatsApp sans
              l’envoyer à un serveur ONLOUTOU.
            </li>
          </ul>
          <p>
            L’adresse contact@onloutou.com est proposée dans le pied de page. Son caractère officiel et le fait
            qu’elle soit bien relevée ne sont pas confirmés. Elle n’est donc pas présentée ici comme le canal
            juridique de l’éditeur. Aucune adresse électronique dédiée à la publication ou à la confidentialité n’a
            été validée.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="publication" number={3} title="Direction de la publication">
        <p>
          Le responsable de la publication du site est {director}. Il répond de la mise en ligne des contenus du site
          public dans la limite de ce rôle. Cette désignation ne le désigne pas, à elle seule, comme représentant
          légal ou gérant de la SARLU.
        </p>
        <p>
          Une demande relative à un contenu du site peut lui être adressée par les canaux de l’article 2.3, en
          indiquant l’adresse de la page et le passage concerné. La procédure de signalement est à l’article 8.
        </p>
      </LegalSection>

      <LegalSection id="hebergement" number={4} title="Hébergement">
        <LegalMissingInformationNotice>{legalProse.hostingPending}</LegalMissingInformationNotice>
        <p>
          Le dépôt du site décrit un site Next.js pouvant être construit en fichiers statiques. Il ne contient pas la
          preuve de l’hébergeur qui sert le site au public. Un prestataire d’infrastructure a pu être envisagé pour un
          déploiement futur. Tant que ce déploiement n’est pas attesté, aucun nom, aucune adresse et aucun téléphone
          d’hébergeur ne sont publiés. Les journaux techniques que cet hébergeur pourrait conserver sont décrits dans
          la politique de confidentialité comme un traitement à confirmer, et non comme un traitement déjà qualifié.
        </p>
      </LegalSection>

      <LegalSection id="objet" number={5} title="Objet du site">
        <p>
          Le site présente les activités d’ONLOUTOU telles qu’elles sont décrites dans les pages publiques : location
          et vente d’équipements professionnels, géolocalisation et objets connectés, gestion de flotte, sécurisation
          d’actifs, plateformes numériques, projets, et informations sur des collaborations avec des partenaires ou
          des livreurs.
        </p>
        <p>
          Le site permet de comprendre une offre, de préparer une demande et d’ouvrir un échange par téléphone ou
          WhatsApp. Il ne conclut pas la location, la vente, la livraison, l’abonnement de géolocalisation ni le
          partenariat. Il ne crée pas de compte, n’encaisse pas de paiement et ne confirme pas une disponibilité.
        </p>
        <p>
          Certaines pages sont des présentations ou des prévisualisations. Elles sont identifiées comme telles dans
          les conditions d’utilisation. Les consulter n’ouvre pas le service décrit.
        </p>
      </LegalSection>

      <LegalSection id="articulation" number={6} title="Documents applicables">
        <p>Les textes se lisent selon leur objet. Aucun ne se substitue à un devis ou à un contrat signé.</p>
        <ul className="leg-list">
          <li>
            Les présentes mentions identifient l’éditeur et renvoient aux autres documents.
          </li>
          <li>
            Les <Link href="/conditions-utilisation">conditions d’utilisation</Link> régissent l’accès au site public
            et la préparation d’une demande. Elles ne fixent ni prix, ni caution, ni durée de location.
          </li>
          <li>
            La <Link href="/confidentialite">politique de confidentialité</Link> décrit les traitements de données
            liés au site. Les données d’une prestation GPS effectivement souscrite relèvent du contrat de cette
            prestation, qui n’est pas formé par la seule visite du site.
          </li>
          <li>
            La <Link href="/cookies">politique relative aux cookies</Link> décrit les stockages réellement observés.
          </li>
          <li>
            Les <Link href="/conditions-commerciales">projets de conditions commerciales</Link> sont des documents de
            travail. Ils ne sont pas en vigueur et n’engagent pas ONLOUTOU.
          </li>
        </ul>
        <p>
          En cas de contradiction, le contrat ou le devis accepté prime pour la prestation concernée. Pour l’usage du
          site seul, les conditions d’utilisation priment sur une phrase générale de ces mentions.
        </p>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" number={7} title="Propriété intellectuelle">
        <LegalSubArticle id="contenus-propres" number="7.1" title="Contenus propres">
          <p>
            Sauf mention contraire sur la page, les textes rédigés pour ONLOUTOU, la structure du site, le logo
            ONLOUTOU et les éléments graphiques créés pour cette communication sont réservés à l’éditeur ou à ses
            titulaires. L’utilisateur peut les consulter et en faire une copie privée temporaire, le temps de la
            consultation, ainsi qu’une citation courte avec le nom ONLOUTOU et l’adresse de la page, lorsque cette
            citation est nécessaire pour discuter de l’offre.
          </p>
          <p>
            Toute autre utilisation — reproduction étendue, réutilisation commerciale, extraction d’un catalogue,
            imitation du logo — suppose une autorisation écrite préalable. La demande se fait par les canaux de
            l’article 2.3, en décrivant le support, la durée et le territoire envisagés. L’absence de réponse ne vaut
            pas autorisation.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="droits-tiers" number="7.2" title="Droits de tiers">
          <p>
            ONLOUTOU ne déclare pas être titulaire de toutes les marques, photographies, vidéos ou interfaces
            montrées. Des visuels peuvent illustrer une famille d’équipements, un reportage ou un outil tiers. Les
            noms de banques cités comme repères de confiance restent la propriété de leurs titulaires. Les marques
            des fabricants d’équipements, de YouTube ou de WhatsApp ne sont pas des marques d’ONLOUTOU.
          </p>
          <p>
            Une vidéo de la page À propos est lue depuis un fichier hébergé avec le site. Une autre vidéo, relative à
            un reportage, n’est chargée depuis YouTube qu’après un clic de l’utilisateur. Leur présence ne transfère
            aucun droit sur l’œuvre diffusée.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="signalement-pi" number="7.3" title="Signalement d’une atteinte">
          <p>
            Toute personne qui estime qu’un contenu porte atteinte à un droit peut le signaler selon l’article 8. Le
            signalement utile précise l’adresse de la page, la description du contenu, la qualité du demandeur et les
            éléments permettant de comprendre le droit invoqué. ONLOUTOU retire ou ajuste le contenu lorsqu’elle
            constate que le signalement est fondé. Elle peut demander un complément si le signalement ne permet pas
            d’identifier le contenu. Aucun délai chiffré de retrait n’est garanti au-delà de ce que la loi impose, ce
            délai n’ayant pas été fixé par une décision interne.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="signalement" number={8} title="Signalement d’une erreur ou d’un contenu litigieux">
        <p>Cette procédure concerne le site, pas l’exécution d’une location ou d’une vente déjà conclue.</p>
        <ol className="leg-ol">
          <li>Identifier la page et, si possible, la phrase, l’image ou la vidéo.</li>
          <li>
            Écrire par téléphone ou par la page contact, ou ouvrir WhatsApp, en indiquant « signalement » dans le
            message.
          </li>
          <li>
            Décrire l’erreur ou le droit en cause, et joindre les éléments que l’utilisateur accepte de transmettre.
            Ne pas envoyer de pièce d’identité, de mot de passe ou de coordonnées bancaires par ces canaux.
          </li>
          <li>
            ONLOUTOU accuse réception lorsqu’elle reçoit effectivement le message, vérifie le contenu et indique la
            suite : correction, maintien motivé, ou demande de précision.
          </li>
        </ol>
        <p>
          Le site ne désigne pas de médiateur de la consommation et ne crée pas d’équipe distincte du contact
          général. Une réclamation sur une prestation suit l’article correspondant des conditions d’utilisation, puis
          le contrat s’il existe.
        </p>
      </LegalSection>

      <LegalSection id="donnees-personnelles" number={9} title="Données personnelles">
        <p>
          Les traitements liés à la visite et aux demandes passées depuis le site sont décrits dans la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>. Cette page ne les résume pas pour éviter
          deux textes divergents. La consultation du site ne vaut pas consentement à de la prospection ni acceptation
          de tous les traitements.
        </p>
      </LegalSection>

      <LegalSection id="cookies" number={10} title="Cookies et technologies similaires">
        <p>
          Les stockages utilisés, le bandeau de choix et la vidéo chargée seulement après un clic sont décrits dans
          la <Link href="/cookies">politique relative aux cookies</Link>. Aucun cookie publicitaire n’est déposé par
          le site dans son état actuel.
        </p>
      </LegalSection>

      <LegalSection id="droit-applicable" number={11} title="Droit applicable">
        <p>
          L’éditeur est une société de droit ivoirien, immatriculée à Abidjan. L’utilisation du site public est
          appréciée selon le droit ivoirien. Lorsqu’un contrat ultérieur est une vente de marchandises entre
          commerçants, le livre de l’Acte uniforme OHADA du 15 décembre 2010 relatif au droit commercial général
          consacré à la vente commerciale peut s’appliquer à ce contrat, et non à la simple consultation du site. La
          location, la livraison et les prestations techniques ne sont pas qualifiées ici de vente commerciale.
        </p>
        <p>
          Ces mentions ne choisissent pas une juridiction exclusive qui écarterait une règle impérative dont
          bénéficierait un non-commerçant. Le tribunal compétent se détermine selon les règles de procédure
          applicables au litige. Le siège étant à Abidjan, les juridictions abidjanaises sont le ressort naturel des
          litiges dirigés contre l’éditeur lorsque ces règles le permettent.
        </p>
        <p>
          Ce choix de loi n’a pas été revu par un cabinet. Il décrit le cadre dans lequel le texte est écrit.
        </p>
      </LegalSection>

      <LegalSection id="sources" number={12} title="Sources et limites de cette rédaction">
        <p>Les points de droit cités s’appuient sur les sources suivantes, lues pour cette version :</p>
        <ul className="leg-list">
          <li>
            Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel, dans le texte
            mis à disposition par l’ANSSI de Côte d’Ivoire, et les explications de l’Autorité de protection
            (autoritedeprotection.ci) sur les droits des personnes et le rôle du responsable de traitement.
          </li>
          <li>
            Acte uniforme OHADA du 15 décembre 2010 portant sur le droit commercial général, notamment la formation
            du contrat de vente commerciale et le fait que le silence ne vaut pas à lui seul acceptation, pour les
            seuls contrats qui entrent dans ce livre.
          </li>
        </ul>
        <p>
          Les pratiques d’autres entreprises n’ont pas été utilisées comme preuve de conformité. Ce document n’est
          pas présenté comme validé par un avocat. La formalité de déclaration ou d’autorisation auprès de l’autorité
          de protection n’est pas jointe, parce qu’elle n’a pas été communiquée.
        </p>
      </LegalSection>

      <LegalSection id="mise-a-jour" number={13} title="Mise à jour du document">
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={legalNoticeLastUpdated}>{formatLegalDateFr(legalNoticeLastUpdated)}</time>. Cette date
          correspond à l’intégration de l’identité confirmée et à la présente rédaction. Une modification du siège,
          de l’hébergeur effectif ou du rôle du site sera reportée ici lorsque le fait sera établi. L’utilisateur
          voit la date en tête de page. Aucun compte n’existant, il n’est pas notifié individuellement d’une
          modification des mentions.
        </p>
      </LegalSection>
    </div>
  );
}

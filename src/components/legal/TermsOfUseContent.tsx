import Link from "next/link";
import { LegalRelatedDocuments } from "@/components/legal/LegalRelatedDocuments";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalSubArticle } from "@/components/legal/LegalSubArticle";
import {
  formatLegalDateFr,
  legalRelatedDocumentLinks,
  termsOfUseLastUpdated,
} from "@/content/legal";
import { site } from "@/content/site";

export function TermsOfUseContent() {
  return (
    <div>
      <LegalRelatedDocuments links={[...legalRelatedDocumentLinks]} currentPath="/conditions-utilisation" />

      <LegalSection id="objet" number={1} title="Objet et champ d’application">
        <p>
          Les présentes conditions régissent l’accès au site public ONLOUTOU et l’usage des fonctions réellement
          disponibles : lire les pages, préparer une demande, ouvrir un lien téléphone ou WhatsApp, regarder une
          vidéo proposée sur le site.
        </p>
        <p>
          Elles s’appliquent à toute personne qui consulte le site, qu’elle soit déjà cliente ou non. Elles ne
          régissent pas la location, la vente, la livraison, la géolocalisation, la maintenance ni le partenariat.
          Ces prestations, lorsqu’elles sont conclues, le sont par un échange distinct : devis, bon ou contrat. Les
          projets de conditions commerciales publiés à part ne sont pas en vigueur.
        </p>
        <p>
          Consulter le site, faire défiler une page ou fermer le bandeau cookies ne vaut pas acceptation d’une
          prospection commerciale ni de l’ensemble des traitements de données. Les traitements sont décrits dans la
          politique de confidentialité.
        </p>
      </LegalSection>

      <LegalSection id="definitions" number={2} title="Définitions">
        <p>Les mots ci-dessous ont le sens indiqué, uniquement pour ces conditions.</p>
        <LegalSubArticle id="def-site" number="2.1" title="Site">
          <p>
            Le site est l’ensemble des pages publiques servies sous la marque ONLOUTOU dans cette version, y compris
            les pages qui annoncent une fonction encore en préparation.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="def-utilisateur" number="2.2" title="Utilisateur">
          <p>L’utilisateur est toute personne qui ouvre le site, avec ou sans intention de commander.</p>
        </LegalSubArticle>
        <LegalSubArticle id="def-client" number="2.3" title="Client">
          <p>
            Le client est la personne qui a accepté une proposition d’ONLOUTOU pour une prestation précise. La seule
            visite, ou l’envoi d’une demande, ne rend pas l’utilisateur client.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="def-partenaire" number="2.4" title="Partenaire et livreur">
          <p>
            Le partenaire est une personne qui propose de collaborer, par exemple comme fournisseur d’équipements ou
            partenaire technique. Le livreur est une personne qui propose de réaliser des courses ou des remises.
            Dans la version actuelle, ces qualités ne s’acquièrent pas par la création d’un compte : les espaces
            correspondants sont des prévisualisations, et une candidature se fait par un message.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="def-demande" number="2.5" title="Demande, devis, réservation, contrat">
          <p>
            La demande est le message que l’utilisateur choisit d’envoyer, en général via WhatsApp, après avoir
            saisi des éléments dans un formulaire du site. Le devis est la proposition écrite ou le message
            d’ONLOUTOU qui indique, pour un besoin identifié, ce qui peut être fait et à quelles conditions. La
            réservation et le contrat n’existent que lorsqu’ONLOUTOU et l’utilisateur se sont accordés sur la
            prestation, en dehors de la simple consultation. Le site ne contient pas de bouton qui réserve un
            équipement ou paie une commande.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="documents" number={3} title="Documents applicables">
        <p>
          Pour l’usage du site, l’ordre de lecture est le suivant : ces conditions, puis la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link> et la{" "}
          <Link href="/cookies">politique cookies</Link> pour les données et les stockages, puis les{" "}
          <Link href="/mentions-legales">mentions légales</Link> pour l’identité de l’éditeur. Pour une prestation,
          le devis ou le contrat accepté prime sur ces pages.
        </p>
        <p>
          Les projets de <Link href="/conditions-commerciales">conditions commerciales</Link> peuvent être lus pour
          voir les sujets que l’entreprise prépare. Ils indiquent eux-mêmes qu’ils ne s’appliquent pas.
        </p>
      </LegalSection>

      <LegalSection id="acces" number={4} title="Accès au site">
        <p>
          Le site est accessible avec un navigateur récent. Certaines fonctions, dont le bandeau cookies et la
          préparation d’un message, nécessitent JavaScript. Sans JavaScript, les pages d’information restent
          lisibles ; les choix interactifs de cookies ne s’affichent pas.
        </p>
        <p>
          L’utilisateur assure la sécurité de son terminal, de sa connexion et des logiciels qu’il emploie.
          ONLOUTOU ne fournit pas l’accès à Internet et ne garantit pas qu’un navigateur ancien affichera toutes les
          pages.
        </p>
        <p>
          L’accès est proposé aux personnes capables de décrire un besoin professionnel ou une demande de
          collaboration. Le site n’est pas un service destiné aux enfants. Voir aussi la politique de confidentialité
          sur les mineurs.
        </p>
      </LegalSection>

      <LegalSection id="services" number={5} title="Services réellement disponibles">
        <LegalSubArticle id="services-ouverts" number="5.1" title="Ce qui fonctionne">
          <p>Dans cette version, l’utilisateur peut :</p>
          <ul className="leg-list">
            <li>lire les pages d’information, les fiches d’activités et le centre d’aide ;</li>
            <li>appeler le {site.phoneDisplay} ;</li>
            <li>
              remplir un formulaire qui prépare un texte, puis ouvrir WhatsApp pour l’envoyer lui-même ;
            </li>
            <li>lire une vidéo locale sur la page À propos, ou lancer après un clic une vidéo YouTube ;</li>
            <li>enregistrer un choix de cookies, sans que ce choix active une mesure d’audience ou une publicité.</li>
          </ul>
        </LegalSubArticle>
        <LegalSubArticle id="services-humains" number="5.2" title="Ce qui dépend d’un traitement humain">
          <p>
            Une demande reçue par téléphone ou WhatsApp est lue par une personne chez ONLOUTOU. La réponse, la
            disponibilité d’un équipement, le prix et le délai ne sont pas calculés par le site. Le site rappelle,
            sur les pages location et vente, qu’aucun stock permanent, aucun tarif catalogue et aucune caution
            générale ne sont affichés.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="services-demo" number="5.3" title="Interfaces de démonstration">
          <p>
            Les espaces partenaire et livreur, certains tableaux de bord et les visuels de produits en préparation
            (notamment des aperçus présentés comme MVP ou « à venir ») montrent une intention de service. Ils ne
            permettent pas de créer un compte, de déposer une pièce, de recevoir une mission ou de payer.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="services-futurs" number="5.4" title="Fonctions futures">
          <p>
            Un catalogue commandable, un paiement, un suivi GPS en direct pour le visiteur du site, et l’ouverture
            réelle des espaces partenaire et livreur ne sont pas des fonctions de cette version. Les décrire sur une
            page n’en avance pas la date.
          </p>
        </LegalSubArticle>
      </LegalSection>

      <LegalSection id="role" number={6} title="Rôle d’ONLOUTOU selon la prestation">
        <p>
          Le site ne fixe pas, à l’avance, si ONLOUTOU sera le fournisseur direct ou un intermédiaire. Les pages de
          location indiquent que la faisabilité dépend du besoin, de la zone et des partenaires mobilisés. Le devis
          ou le contrat dira lequel des deux rôles est retenu :
        </p>
        <ul className="leg-list">
          <li>
            fournisseur direct, lorsque ONLOUTOU s’engage elle-même à fournir l’équipement ou la prestation ;
          </li>
          <li>
            intermédiaire ou coordinateur, lorsqu’ONLOUTOU qualifie le besoin et met en relation ou organise
            l’intervention d’un tiers, sans que ce tiers soit engagé par la seule page du site.
          </li>
        </ul>
        <p>
          Tant que ce rôle n’est pas écrit dans la proposition acceptée, l’utilisateur ne peut pas exiger l’un ou
          l’autre. ONLOUTOU ne se présente pas comme transporteur public ni comme exploitant d’une plateforme de
          mise en relation ouverte.
        </p>
      </LegalSection>

      <LegalSection id="contenus-site" number={7} title="Catégories, fiches, photographies et démonstrations">
        <p>
          Les familles d’équipements, les photographies et les exemples d’interfaces illustrent des usages. Ils ne
          sont pas un stock, un prix, une fiche technique contractuelle ni une promesse que le matériel photographié
          sera celui remis. Les couleurs, modèles et accessoires sont confirmés dans l’échange qui suit la demande.
        </p>
        <p>
          Une démonstration de tableau de bord ou de parcours partenaire montre un principe de fonctionnement. Les
          données affichées dans ces aperçus ne sont pas les données d’un client réel, sauf mention expresse sur la
          page. Les pages concernées indiquent lorsqu’aucun produit réel n’est chargé.
        </p>
      </LegalSection>

      <LegalSection id="demandes-contact" number={8} title="Demandes et échanges">
        <p>Le parcours ordinaire est le suivant.</p>
        <ol className="leg-ol">
          <li>
            L’utilisateur saisit, dans son navigateur, les éléments demandés : besoin, zone, quantités ou contraintes.
            Tant qu’il n’ouvre pas WhatsApp ou n’appelle pas, ces éléments restent dans la page. Le code du site ne
            les envoie pas à une API ONLOUTOU.
          </li>
          <li>
            S’il utilise un parcours qui mémorise un choix pour la page suivante, ce choix est placé dans le
            sessionStorage du navigateur, sous un nom commençant par onloutou-. Il disparaît à la fermeture de
            l’onglet ou lorsqu’il est repris par le formulaire.
          </li>
          <li>
            Le bouton d’envoi ouvre WhatsApp avec un texte déjà rédigé. L’utilisateur peut encore le modifier. Le
            message n’est transmis à ONLOUTOU que si l’utilisateur l’envoie dans WhatsApp. À partir de cet envoi, les
            conditions de WhatsApp s’appliquent aussi.
          </li>
          <li>
            Un fichier choisi dans un formulaire n’est pas téléversé. Seules les informations que le formulaire
            copie dans le texte, par exemple un nom de fichier, peuvent figurer dans le message.
          </li>
        </ol>
        <p>
          <Link href="/contact">Page contact</Link>. Ne pas placer dans ces messages de pièce d’identité, de mot de
          passe ou de coordonnées bancaires : ces canaux ne sont pas un coffre de pièces.
        </p>
      </LegalSection>

      <LegalSection id="formation-contrat" number={9} title="Demande, devis, acceptation et confirmation">
        <p>
          Recevoir une demande n’oblige pas ONLOUTOU à établir un devis, ni à réserver un matériel. ONLOUTOU peut
          demander une précision, indiquer qu’elle ne peut pas traiter le besoin, ou transmettre une proposition.
        </p>
        <p>
          Une proposition devient un accord lorsque les deux parties ont accepté le même objet : prestation, durée
          ou quantité lorsque c’est pertinent, prix, et modalités essentielles. Le silence, la lecture d’une page ou
          le fait de laisser un formulaire ouvert ne valent pas acceptation. Cette règle est aussi celle de la vente
          commerciale OHADA lorsque ce régime s’applique au contrat ultérieur : le silence ou l’inaction ne
          constituent pas à eux seuls une acceptation.
        </p>
        <p>
          Une réponse qui change un élément essentiel, par exemple le prix ou la durée, est une nouvelle proposition,
          pas une acceptation de la précédente. La confirmation utile est un message clair des deux côtés, ou un
          document que les deux parties reconnaissent. Le site n’émet pas de numéro de commande.
        </p>
      </LegalSection>

      <LegalSection id="comptes" number={10} title="Comptes, habilitations et sécurité">
        <p>
          Le site public ne propose pas de compte, d’identifiant ni de mot de passe. Il n’y a donc pas d’habilitation
          à gérer, ni de procédure de clôture de compte. Les espaces qui montreront plus tard un tableau de bord ne
          sont pas ouverts.
        </p>
        <p>
          Chacun reste responsable des messages qu’il envoie depuis son téléphone ou son application WhatsApp.
          ONLOUTOU ne demande pas un mot de passe par message. Un message qui le ferait ne vient pas de la procédure
          du site.
        </p>
      </LegalSection>

      <LegalSection id="engagements" number={11} title="Engagements de l’utilisateur">
        <p>L’utilisateur s’engage à :</p>
        <ul className="leg-list">
          <li>décrire son besoin de façon sincère, sans présenter comme certaine une information qu’il ignore ;</li>
          <li>utiliser les formulaires pour un besoin réel, et non pour saturer les canaux ;</li>
          <li>ne pas saisir, dans un champ libre, les données d’une autre personne sans être en droit de le faire ;</li>
          <li>vérifier le devis avant de l’accepter, plutôt que de se fonder sur une photo du site.</li>
        </ul>
        <p>
          ONLOUTOU s’engage, de son côté, à présenter le site conformément à ce qu’il fait vraiment, à ne pas afficher
          un prix comme ferme s’il ne l’est pas, et à traiter une demande reçue par les canaux prévus lorsqu’elle est
          exploitable. Elle ne s’engage pas sur un délai de réponse chiffré : aucun délai interne n’a été arrêté.
        </p>
      </LegalSection>

      <LegalSection id="utilisations-interdites" number={12} title="Usages interdits">
        <p>Il est interdit d’utiliser le site pour :</p>
        <ul className="leg-list">
          <li>tenter d’accéder à une zone non publiée, à un compte inexistant ou au code du serveur ;</li>
          <li>introduire un code malveillant ou lancer des requêtes destinées à rendre le site inutilisable ;</li>
          <li>collecter des données d’autres personnes à partir du site ;</li>
          <li>présenter une demande fictive de manière répétée ;</li>
          <li>réutiliser les contenus au-delà de ce que l’article 14 et les mentions autorisent.</li>
        </ul>
        <p>
          Ces interdictions ne créent pas, à elles seules, une pénalité financière. Les suites possibles sont
          l’interruption de l’échange, le refus de traiter la demande et, si les faits le justifient, un signalement
          aux autorités compétentes. Aucune amende contractuelle n’est fixée ici.
        </p>
      </LegalSection>

      <LegalSection id="contenus-utilisateurs" number={13} title="Contenus transmis par les utilisateurs">
        <p>
          Les textes saisis dans les formulaires et les messages envoyés restent de la responsabilité de leur
          auteur. L’utilisateur garantit qu’il peut communiquer ces informations à ONLOUTOU pour l’étude de sa
          demande. Il ne transmet pas de contenu illicite.
        </p>
        <p>
          En envoyant le message, il autorise ONLOUTOU à le lire et à le conserver le temps d’y répondre et, si une
          prestation suit, le temps nécessaire à cette prestation et aux obligations qui en découlent. Cette
          autorisation ne cède pas à ONLOUTOU un droit d’exploiter le message à des fins publicitaires. Le détail
          des durées, lorsqu’il n’est pas fixé, est dans la politique de confidentialité.
        </p>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" number={14} title="Propriété intellectuelle">
        <p>
          Les droits sur les contenus du site, les usages permis, les demandes d’autorisation et le signalement
          d’une atteinte sont rédigés à l’article 7 des{" "}
          <Link href="/mentions-legales#propriete-intellectuelle">mentions légales</Link>. Ces conditions n’ajoutent
          pas une cession de droits au profit d’ONLOUTOU du seul fait de la visite.
        </p>
      </LegalSection>

      <LegalSection id="liens-externes" number={15} title="Services et liens de tiers">
        <p>
          Le site propose des liens vers WhatsApp, le téléphone, des réseaux sociaux, une fiche d’avis et, après un
          clic, une vidéo YouTube. ONLOUTOU n’exploite pas ces services. Lorsque l’utilisateur les ouvre, il quitte
          le fonctionnement du site ou charge le service tiers. Les conditions de ce tiers s’appliquent alors à cet
          usage.
        </p>
        <p>
          ONLOUTOU ne contrôle pas le contenu d’une page tierce ni les cookies que ce tiers peut déposer après le
          clic. Elle choisit les liens qu’elle affiche et peut les retirer s’ils deviennent inexacts.
        </p>
      </LegalSection>

      <LegalSection id="disponibilite" number={16} title="Disponibilité technique et maintenance">
        <p>
          ONLOUTOU cherche à garder le site accessible. Elle peut l’interrompre pour une correction, une mise à jour
          ou un incident, sans prévenir individuellement chaque visiteur, faute de compte permettant cette alerte.
          Une interruption du site n’annule pas un contrat déjà formé par un autre canal. Elle peut seulement
          retarder une nouvelle demande.
        </p>
        <p>
          L’hébergeur effectif n’étant pas encore nommé dans les mentions, la disponibilité de production ne peut
          pas être décrite plus précisément. Aucun taux de disponibilité n’est promis.
        </p>
      </LegalSection>

      <LegalSection id="suspension" number={17} title="Suspension et fin d’accès">
        <p>
          Comme il n’existe pas de compte, la mesure adaptée est de cesser de répondre à une demande ou de limiter
          un usage abusif du site, et non de « clôturer un espace ». ONLOUTOU peut le faire lorsque l’usage entre
          dans l’article 12, lorsque le message contient un contenu illicite, ou lorsque la demande ne peut pas être
          traitée. Elle indique le motif lorsqu’elle répond. Elle n’est pas tenue de poursuivre un échange qui
          sert uniquement à nuire au canal.
        </p>
        <p>
          L’utilisateur peut, de son côté, arrêter d’utiliser le site à tout moment. Cela n’efface pas un contrat
          déjà accepté ni un message déjà envoyé sur WhatsApp.
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" number={18} title="Responsabilités">
        <p>
          ONLOUTOU est responsable des informations qu’elle décide de publier et de la façon dont le site transmet
          une demande vers le canal choisi. Elle corrige une erreur signalée selon l’article 8 des mentions, dans la
          mesure où le signalement permet de la trouver.
        </p>
        <p>
          Elle n’est pas responsable du délai ou du contenu d’un service tiers après que l’utilisateur l’a ouvert,
          ni d’une décision prise sur la seule foi d’une photographie alors qu’un devis était nécessaire. Elle ne
          promet pas l’absence totale d’erreur, l’absence d’interruption, ni la sécurité absolue d’Internet.
        </p>
        <p>
          Ces limites ne retirent pas une responsabilité que la loi ne permet pas d’écarter, notamment en cas de
          faute prouvée sur une information essentielle que l’éditeur aurait maintenue en connaissant son caractère
          faux. Aucun plafond d’indemnité n’est écrit ici : un plafond relève du contrat de prestation, qui n’est
          pas formé par ces conditions.
        </p>
      </LegalSection>

      <LegalSection id="donnees-cookies" number={19} title="Données personnelles et cookies">
        <p>
          Les données sont traitées selon la <Link href="/confidentialite">politique de confidentialité</Link>. Les
          stockages le sont selon la <Link href="/cookies">politique cookies</Link>. Accepter ces conditions
          d’utilisation n’est pas un consentement séparé à la prospection ou à des traceurs non essentiels. Le site
          n’en dépose pas dans cette version.
        </p>
      </LegalSection>

      <LegalSection id="conditions-commerciales" number={20} title="Conditions commerciales">
        <p>
          Le prix, la durée, la remise, la restitution, le paiement, la conformité, l’assurance, la caution et les
          pénalités ne sont pas décidés dans ces conditions. Lorsqu’un sujet de ce type compte pour une prestation,
          il doit figurer dans le devis ou le contrat. À défaut, il n’est pas dû.
        </p>
        <p>
          Des projets séparés, clairement non applicables, sont réunis sur la page{" "}
          <Link href="/conditions-commerciales">projets de conditions commerciales</Link>. Ils listent les paramètres
          qui restent à trancher. Les lire ne crée pas ces obligations.
        </p>
      </LegalSection>

      <LegalSection id="espaces-partenaire-livreur" number={21} title="Espaces partenaire et livreur">
        <p>
          Les pages <Link href="/espace-partenaire">espace partenaire</Link> et{" "}
          <Link href="/espace-livreur">espace livreur</Link> sont des aperçus. S’y promener ne crée pas de contrat de
          partenariat, de mandat ou de prestation de livraison. Une personne qui souhaite collaborer envoie une
          présentation par les formulaires ou WhatsApp prévus. ONLOUTOU répond si la présentation est exploitable.
          L’ouverture d’un compte, la remise de documents d’identité, l’attribution de missions et le paiement
          seront décrits dans des conditions propres avant la mise en service, et non avant.
        </p>
      </LegalSection>

      <LegalSection id="reclamations" number={22} title="Réclamations">
        <p>
          Une réclamation sur le site ou sur une demande en cours s’adresse aux mêmes canaux que le contact général :
          téléphone {site.phoneDisplay}, WhatsApp, ou <Link href="/contact#reclamations">page contact</Link>. Il n’y
          a pas d’adresse, d’équipe ou de médiateur distinct.
        </p>
        <p>Le message utile contient :</p>
        <ul className="leg-list">
          <li>le nom de la personne ou de la structure, et un moyen de répondre ;</li>
          <li>la page, le message ou la prestation concernés ;</li>
          <li>ce qui est demandé : correction, explication, ou suite à donner à une demande.</li>
        </ul>
        <p>
          ONLOUTOU lit la réclamation reçue, peut demander un élément manquant, puis indique ce qu’elle fait. Aucun
          délai garanti n’a été arrêté. Si la réclamation porte sur un contrat déjà formé, les échanges déjà
          convenus pour ce contrat s’ajoutent à ce canal. Cette page ne remplace pas une action en justice.
        </p>
      </LegalSection>

      <LegalSection id="modification" number={23} title="Modification des conditions">
        <p>
          ONLOUTOU peut modifier ces conditions lorsque le site change, par exemple si un compte ou un paiement est
          réellement ouvert. La date en tête de page est mise à jour. La version affichée au moment de la visite
          s’applique à cette visite. Une prestation déjà acceptée reste régie par ce qui a été accepté, sauf accord
          contraire.
        </p>
        <p>
          Dernière mise à jour :{" "}
          <time dateTime={termsOfUseLastUpdated}>{formatLegalDateFr(termsOfUseLastUpdated)}</time>.
        </p>
      </LegalSection>

      <LegalSection id="droit-applicable" number={24} title="Droit applicable et différends">
        <p>
          Ces conditions sont écrites selon le droit ivoirien, l’éditeur étant une SARLU immatriculée à Abidjan. Le
          livre OHADA sur la vente commerciale n’est cité qu’à titre de repère pour un éventuel contrat de vente
          entre commerçants. Il ne transforme pas l’usage du site en vente.
        </p>
        <p>
          En cas de différend, l’utilisateur peut d’abord suivre l’article 22. Si le différend demeure, il est porté
          devant la juridiction compétente selon les règles de procédure, le siège d’ONLOUTOU étant à Abidjan. Aucune
          clause ne retire au non-commerçant une protection impérative. Ce texte n’a pas été validé par un cabinet.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={25} title="Contact">
        <p>
          Pour une question sur ces conditions : <Link href="/contact">contacter ONLOUTOU</Link>, ou appeler{" "}
          <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>. Les{" "}
          <Link href="/mentions-legales">mentions légales</Link> identifient l’éditeur.
        </p>
      </LegalSection>
    </div>
  );
}

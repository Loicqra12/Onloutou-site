import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalSubArticle } from "@/components/legal/LegalSubArticle";
import { site } from "@/content/site";

function Pending({ items }: { items: string[] }) {
  return (
    <div className="leg-gap">
      <p>
        <strong>Paramètres non décidés.</strong> Les points suivants ne figurent dans aucun tarif, barème ou contrat
        type du site. Tant qu’ils ne sont pas écrits dans un devis accepté, ils ne sont pas dus.
      </p>
      <ul className="leg-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CommercialDraftsContent() {
  return (
    <div>
      <p className="leg-gap">
        Document de travail du 5 novembre 2026. Ces projets ne sont pas des conditions générales de vente. Ils
        n’engagent pas ONLOUTOU, ne s’appliquent à aucune demande en cours et ne remplacent pas un devis. Ils
        préparent les clauses qui pourront être soumises lorsqu’une décision interne existera.
      </p>

      <LegalSection id="location" number={1} title="Projet — location d’équipements">
        <p>
          La page location décrit une demande, une qualification avec les partenaires mobilisés, puis une proposition.
          Aucun stock permanent ni tarif n’est affiché. Le projet ci-dessous suit cet ordre, sans inventer de caution
          ni de durée minimale.
        </p>
        <LegalSubArticle id="location-disponibilite" number="1.1" title="Disponibilité">
          <p>
            Une fiche ou une photo ne réserve pas le matériel. La disponibilité est confirmée dans la proposition,
            pour une période et une zone nommées. Si le matériel dépend d’un partenaire, la proposition le dit.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="location-contrat" number="1.2" title="Formation du contrat">
          <p>
            Le contrat de location naît lorsque le demandeur accepte une proposition qui précise au moins le matériel,
            la période, le lieu de mise à disposition et le prix. Le silence ne vaut pas acceptation. Le site ne
            forme pas ce contrat.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="location-usage" number="1.3" title="Usage, entretien, incident, restitution">
          <p>
            L’utilisateur pressenti ne peut pas sous-louer ni sortir le matériel de la zone convenue sans accord.
            L’entretien courant pendant la mise à disposition, la conduite du constat en cas de dommage, et les
            modalités de remise et de restitution seront ceux de la proposition. Le projet ne choisit pas qui supporte
            l’usure normale, ni comment l’état est décrit à la remise.
          </p>
        </LegalSubArticle>
        <Pending
          items={[
            "Durée minimale et mode de calcul d’une prolongation",
            "Existence, montant et restitution d’une caution",
            "Assurance exigée, franchise et conducteur autorisé",
            "Lieu et horaire de remise et de restitution",
            "Pénalité de retard ou de casse, s’il doit y en avoir une",
          ]}
        />
      </LegalSection>

      <LegalSection id="vente" number={2} title="Projet — vente d’équipements">
        <p>
          La page vente oriente vers un devis selon disponibilité. Elle n’est pas une boutique. Si la vente est plus
          tard conclue entre commerçants et porte sur des marchandises, l’Acte uniforme OHADA sur la vente commerciale
          peut s’appliquer à ce contrat. Ce projet n’en fixe pas le prix ni la livraison.
        </p>
        <LegalSubArticle id="vente-commande" number="2.1" title="Commande, prix, paiement">
          <p>
            Une commande n’existe qu’après acceptation d’un devis. Le prix est celui du devis, pas celui d’une page.
            Le moyen de paiement n’est pas proposé sur le site. Aucun acompte n’est défini.
          </p>
        </LegalSubArticle>
        <LegalSubArticle id="vente-conformite" number="2.2" title="Livraison, conformité, garanties">
          <p>
            Le vendeur devra livrer un matériel conforme à ce qui a été décrit dans le devis. Le délai de livraison
            et le transfert des risques seront ceux du devis. Les garanties légales applicables à un acheteur non
            commerçant ne sont pas écartées. Leur mise en œuvre concrète, et toute garantie commerciale supplémentaire,
            restent à écrire. Aucune durée de garantie commerciale n’est publiée.
          </p>
        </LegalSubArticle>
        <Pending
          items={[
            "Acompte, solde et instrument de paiement",
            "Lieu de livraison et qui organise le transport",
            "Délai de rétractation, s’il est dû au-delà des règles impératives",
            "Durée et périmètre d’une garantie commerciale",
          ]}
        />
      </LegalSection>

      <LegalSection id="livraison" number={3} title="Projet — livraison et coordination">
        <p>
          Les pages de livraison indiquent un service en préparation. On peut déjà décrire un besoin pour être
          recontacté. Il n’existe pas de mission affectée depuis le site, ni de preuve de remise électronique.
        </p>
        <LegalSubArticle id="livraison-mission" number="3.1" title="Mission, biens, incident">
          <p>
            Une mission n’existera que lorsqu’un accord écrira le lieu de collecte, le lieu de remise, la nature des
            biens acceptés et le prix. Les biens exclus, par exemple les matières dangereuses ou les valeurs, ne sont
            pas listés faute de décision. En cas d’incident, la personne à prévenir et la preuve de remise seront
            celles du futur accord. Le site ne produit pas aujourd’hui de signature ou de photo de livraison.
          </p>
        </LegalSubArticle>
        <Pending
          items={[
            "Biens refusés",
            "Assurance du transport et plafond",
            "Preuve de collecte et de remise",
            "Sort d’un destinataire absent",
          ]}
        />
      </LegalSection>

      <LegalSection id="gps" number={4} title="Projet — GPS et prestations techniques">
        <p>
          Les pages de géolocalisation, de flotte et d’équipements connectés présentent un besoin et des exemples.
          Elles ne collectent pas de position et n’installent pas de boîtier. Le contrat, s’il est signé, devra
          séparer ce qu’ONLOUTOU fait de ce que le client professionnel décide pour ses propres conducteurs.
        </p>
        <LegalSubArticle id="gps-perimetre" number="4.1" title="Périmètre, données, fin de prestation">
          <p>
            La proposition devra dire si la prestation comprend la fourniture d’un boîtier, l’installation, l’accès
            à une interface, la connectivité, et l’assistance. Les positions et identifiants ne seront collectés
            qu’après cet accord, avec l’information des personnes concernées. La fin de prestation devra dire qui
            récupère le matériel et ce qu’il advient des historiques. Rien de cela n’est actif sur le site.
          </p>
        </LegalSubArticle>
        <Pending
          items={[
            "Abonnement, durée et reconduction",
            "Qui est responsable du traitement des positions",
            "Durée de conservation des traces",
            "Niveau d’assistance et plages horaires",
            "Sort des boîtiers en fin de contrat",
          ]}
        />
      </LegalSection>

      <LegalSection id="partenaires" number={5} title="Projet — partenaires et livreurs">
        <p>
          Les espaces en ligne sont des prévisualisations. Aucune commission, aucun engagement d’exclusivité et aucun
          volume de missions ne sont décidés. Une personne peut seulement se présenter. Avant l’ouverture réelle, des
          conditions séparées devront exister. Elles ne sont pas celles de cette page.
        </p>
        <Pending
          items={[
            "Pièces demandées à l’ouverture d’un compte",
            "Commission ou mode de rémunération",
            "Qui facture le client final",
            "Assurance du livreur et biens qu’il peut prendre en charge",
          ]}
        />
        <p>
          Retour aux <Link href="/conditions-utilisation#conditions-commerciales">conditions d’utilisation</Link>.
          Téléphone : <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>.
        </p>
      </LegalSection>
    </div>
  );
}

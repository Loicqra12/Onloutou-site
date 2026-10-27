import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { productsCatalogFuture, publishedProductCatalog } from "@/content/products-page";

export function ProductsCatalogFuture() {
  const data = productsCatalogFuture;
  const count = publishedProductCatalog.length;

  return (
    <section className="prd-future section-spacing bg-brand-paper" aria-labelledby="prd-future-title">
      <div className="container-content">
        <Reveal>
          <h2 id="prd-future-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {data.title}
          </h2>
          <p className="prd-future__lead">{data.lead}</p>
        </Reveal>
        <dl className="prd-future__statuses">
          {data.statuses.map((s) => (
            <div key={s.key}>
              <dt>{s.label}</dt>
              <dd>Statut {s.key} — pour fiches validées uniquement</dd>
            </div>
          ))}
        </dl>
        <EditorialNotice>
          {count === 0
            ? "Aucune fiche produit publiée pour le moment — pas de route /produits/[slug] tant qu’une référence complète n’est pas validée."
            : `${count} référence(s) validée(s) — publication à activer dans le contenu.`}
        </EditorialNotice>
      </div>
    </section>
  );
}

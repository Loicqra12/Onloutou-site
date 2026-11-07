"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type PublicProduct = { id: string; title: string; category: string; description: string | null };

const categoryLabel: Record<string, string> = {
  VEHICLES: "Véhicules",
  MOTORCYCLES: "Motos",
  TRUCKS_MACHINERY: "Camions et engins",
  TOOLS: "Outils et matériel",
  CONNECTED: "Équipements connectés",
  OTHER: "Autre",
};

/**
 * Fiches partenaires validées par l’équipe ONLOUTOU (lecture de l’API publique).
 * N’affiche rien tant qu’aucune fiche n’est validée : aucune disponibilité ni tarif n’est annoncé.
 */
export function PublishedPartnerProducts() {
  const [items, setItems] = useState<PublicProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await apiFetch<{ products: PublicProduct[] }>("/catalog/products");
      if (!cancelled && res.ok) setItems(res.data.products);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="prd-partner-published-title" data-testid="published-partner-products">
      <h3 id="prd-partner-published-title" className="font-display text-xl font-extrabold">
        Fiches partenaires validées
      </h3>
      <p>Disponibilité et conditions sont confirmées après étude de votre besoin.</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> — {categoryLabel[item.category] ?? item.category}
            {item.description ? <span> · {item.description}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

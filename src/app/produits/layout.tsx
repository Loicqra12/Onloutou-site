import type { ReactNode } from "react";
import "@/styles/produits-hub.css";

export default function ProduitsLayout({ children }: { children: ReactNode }) {
  return <div className="prd-shell">{children}</div>;
}

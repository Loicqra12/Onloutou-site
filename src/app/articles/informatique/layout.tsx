import type { ReactNode } from "react";
import { InfRequestProvider } from "@/components/informatique/InfRequest";
import "@/styles/informatique.css";
import "@/styles/universe-t54.css";

export default function InformatiqueLayout({ children }: { children: ReactNode }) {
  return <InfRequestProvider>{children}</InfRequestProvider>;
}
import type { ReactNode } from "react";
import { RecRequestProvider } from "@/components/reception/RecRequest";
import "@/styles/reception.css";
import "@/styles/universe-t54.css";

export default function ReceptionLayout({ children }: { children: ReactNode }) {
  return <RecRequestProvider>{children}</RecRequestProvider>;
}

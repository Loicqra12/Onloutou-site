import type { ReactNode } from "react";
import { EnfRequestProvider } from "@/components/enfance/EnfRequest";
import "@/styles/enfance.css";
import "@/styles/universe-t54.css";

export default function EnfanceLayout({ children }: { children: ReactNode }) {
  return <EnfRequestProvider>{children}</EnfRequestProvider>;
}

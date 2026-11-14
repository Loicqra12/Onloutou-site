import type { ReactNode } from "react";
import { ElmRequestProvider } from "@/components/electromenager/ElmRequest";
import "@/styles/electromenager.css";
import "@/styles/universe-t54.css";

export default function ElectromenagerLayout({ children }: { children: ReactNode }) {
  return <ElmRequestProvider>{children}</ElmRequestProvider>;
}

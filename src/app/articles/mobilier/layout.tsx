import type { ReactNode } from "react";
import { MobRequestProvider } from "@/components/mobilier/MobRequest";
import "@/styles/mobilier.css";
import "@/styles/universe-t54.css";

export default function MobilierLayout({ children }: { children: ReactNode }) {
  return <MobRequestProvider>{children}</MobRequestProvider>;
}
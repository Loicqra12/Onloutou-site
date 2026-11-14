import type { Metadata } from "next";
import { PartnerNotifications } from "@/components/partners/PartnerNotifications";
import { PartnerSpaceShell } from "@/components/partners/PartnerSpaceShell";

export const metadata: Metadata = { title: "Notifications", robots: { index: false, follow: false } };

export default function PartnerNotificationsPage() {
  return (
    <PartnerSpaceShell>
      <PartnerNotifications />
    </PartnerSpaceShell>
  );
}

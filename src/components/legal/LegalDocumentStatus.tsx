import type { LegalDocumentStatus as LegalDocumentStatusType } from "@/types/legal";

type Banner = { title: string; lead: string };

type LegalDocumentStatusProps = {
  status: LegalDocumentStatusType;
  banner: Banner;
};

export function LegalDocumentStatus({ status, banner }: LegalDocumentStatusProps) {
  if (status === "validated" || status === "published") {
    return null;
  }

  return (
    <div className="leg-status" role="status">
      <p className="leg-status__title">{banner.title}</p>
      <p className="leg-status__lead">{banner.lead}</p>
    </div>
  );
}

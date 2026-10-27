export type DataProcessingStatus = "verified" | "to-confirm" | "planned";

export type TrackingStatus =
  | "none-detected"
  | "essential-only"
  | "non-essential"
  | "to-confirm";

export type DataProcessingActivity = {
  id: string;
  title: string;
  status: DataProcessingStatus;
  dataCategories: string[];
  purposes: string[];
  source: string;
  recipients: string[];
  storage: string | null;
  retention: string | null;
  legalBasis: string | null;
  userActionRequired: boolean;
};

export type ThirdPartyService = {
  id: string;
  name: string;
  purpose: string;
  website?: string;
  privacyUrl?: string;
  dataCategories: string[];
  active: boolean;
  status: DataProcessingStatus;
  transferMoment?: string;
};

export type LegalDocumentStatus =
  | "draft"
  | "awaiting-validation"
  | "validated"
  | "published";

export type LegalFieldStatus = "verified" | "missing" | "to-confirm";

export type VerifiedLegalField = {
  value: string | null;
  status: LegalFieldStatus;
  /** Usage interne / compte rendu — ne pas afficher sur la page publique. */
  source?: string;
  lastVerifiedAt?: string;
};

export type LegalEntityInformation = {
  commercialName: VerifiedLegalField;
  legalName: VerifiedLegalField;
  legalForm: VerifiedLegalField;
  capital: VerifiedLegalField;
  registryNumber: VerifiedLegalField;
  taxNumber: VerifiedLegalField;
  registeredOffice: VerifiedLegalField;
  publicPhone: VerifiedLegalField;
  publicEmail: VerifiedLegalField;
  publicationDirector: VerifiedLegalField;
  legalRepresentative: VerifiedLegalField;
};

export type HostingInformation = {
  providerName: VerifiedLegalField;
  legalName: VerifiedLegalField;
  address: VerifiedLegalField;
  website: VerifiedLegalField;
  phone: VerifiedLegalField;
};

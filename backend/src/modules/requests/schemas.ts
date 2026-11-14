import { z } from "zod";

const contactNeedMap = {
  location: "CONTACT",
  gps: "GPS",
  actifs: "ASSET_SECURITY",
  numerique: "CUSTOM_PLATFORM",
  partenariat: "PARTNER_SUPPLIER",
  autre: "OTHER",
} as const;

export const createContactRequestSchema = z.object({
  source: z.literal("contact"),
  need: z.enum(["location", "gps", "actifs", "numerique", "partenariat", "autre"]),
  name: z.string().min(2).max(120),
  phone: z.string().max(40).optional(),
  email: z.string().email().max(320).optional(),
  organisation: z.string().max(200).optional(),
  zone: z.string().max(200).optional(),
  deadline: z.string().max(200).optional(),
  message: z.string().min(5).max(8000),
  familyLabel: z.string().trim().min(2).max(120).optional(),
  sourcePath: z.string().max(500).optional(),
  openWhatsAppAfter: z.boolean().optional(),
  clientRequestId: z.string().min(8).max(64).optional(),
});

const requestTypeEnum = z.enum([
  "CONTACT",
  "PRODUCT",
  "RENTAL",
  "PURCHASE",
  "GPS",
  "ASSET_SECURITY",
  "CUSTOM_PLATFORM",
  "EQUIPMENT_CATALOG",
  "DELIVERY",
  "PARTNER_SUPPLIER",
  "PARTNER_DELIVERY",
  "PARTNER_TECH",
  "OTHER",
]);

export const createGenericRequestSchema = z.object({
  source: z.string().max(80),
  type: requestTypeEnum,
  contactName: z.string().min(2).max(120),
  contactPhone: z.string().max(40).optional(),
  contactEmail: z.string().email().max(320).optional(),
  organization: z.string().max(200).optional(),
  zone: z.string().max(200).optional(),
  message: z.string().min(5).max(8000),
  payload: z.record(z.unknown()).optional(),
  sourcePath: z.string().max(500).optional(),
  clientRequestId: z.string().min(8).max(64).optional(),
});

const optionalEmail = z
  .string()
  .max(320)
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : undefined))
  .pipe(z.union([z.undefined(), z.string().email()]));

export const createAdminDossierSchema = z.object({
  origin: z.enum(["phone", "whatsapp", "web", "other"]),
  contactName: z.string().min(2).max(120),
  contactPhone: z.string().max(40).optional(),
  contactEmail: optionalEmail,
  organization: z.string().max(200).optional(),
  clientKind: z.enum(["professional", "individual"]).optional(),
  assigneeId: z.string().min(8).max(64),
  contactDate: z.string().max(40).optional(),
  internalNote: z.string().max(4000).optional(),
  articles: z
    .array(
      z.object({
        title: z.string().min(2).max(200),
        quantity: z.coerce.number().int().min(1).max(9999),
        unit: z.string().max(40).optional(),
        productId: z.string().max(64).optional(),
        familyLabel: z.string().max(120).optional(),
      }),
    )
    .min(1)
    .max(30),
  startDate: z.string().max(40).optional(),
  endDate: z.string().max(40).optional(),
  datesToConfirm: z.boolean().optional(),
  city: z.string().max(80).optional(),
  commune: z.string().min(2).max(80),
  address: z.string().max(300).optional(),
  usage: z.string().min(3).max(500),
  services: z.object({
    delivery: z.boolean(),
    pickup: z.boolean(),
    install: z.boolean(),
  }),
  accessNotes: z.string().max(500).optional(),
  clientRequestId: z.string().min(8).max(64).optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(["RECEIVED", "IN_REVIEW", "WAITING_CLIENT", "QUOTED", "CLOSED", "CANCELLED"]),
  note: z.string().max(4000).optional(),
});

export const listRequestsQuerySchema = z.object({
  status: z
    .enum(["RECEIVED", "IN_REVIEW", "WAITING_CLIENT", "QUOTED", "CLOSED", "CANCELLED"])
    .optional(),
  type: requestTypeEnum.optional(),
  q: z.string().max(120).optional(),
  open: z.enum(["1", "true", "0", "false"]).optional(),
  bucket: z.enum(["qualify", "proposition", "confirmed", "running", "closed"]).optional(),
  origin: z.enum(["web", "phone", "whatsapp", "other"]).optional(),
  assignee: z.string().max(80).optional(),
  take: z.coerce.number().int().min(1).max(100).default(25),
  skip: z.coerce.number().int().min(0).default(0),
});

export function contactNeedToType(need: z.infer<typeof createContactRequestSchema>["need"]) {
  const mapped = contactNeedMap[need];
  if (need === "location") return "CONTACT" as const;
  if (need === "partenariat") return "PARTNER_SUPPLIER" as const;
  return mapped as
    | "GPS"
    | "ASSET_SECURITY"
    | "CUSTOM_PLATFORM"
    | "OTHER"
    | "CONTACT"
    | "PARTNER_SUPPLIER";
}

export const searchArticlesQuerySchema = z.object({
  q: z.string().max(120).optional(),
  owner: z.enum(["all", "onloutou", "partner"]).default("all"),
  commune: z.string().max(80).optional(),
  startDate: z.string().max(40).optional(),
  endDate: z.string().max(40).optional(),
});

export const saveSelectionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(8).max(64),
        quantity: z.coerce.number().int().min(1).max(9999).default(1),
      }),
    )
    .max(30),
});

export const createPartnerDemandSchema = z.object({
  productId: z.string().min(8).max(64),
  quantity: z.coerce.number().int().min(1).max(9999),
  startDate: z.string().min(8).max(10),
  endDate: z.string().min(8).max(10),
  commune: z.string().min(2).max(80),
  delivery: z.boolean().default(true),
  pickup: z.boolean().default(true),
  placeLabel: z.string().max(200).optional(),
  message: z.string().min(8).max(2000),
  replyByDate: z.string().max(10).optional(),
  replyByTime: z.string().max(8).optional(),
  notifyEmail: z.boolean().optional(),
});

export const saveProposalSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(8).max(64),
        clientPrice: z.string().max(40).optional(),
        priceUnit: z.string().max(40).optional(),
        partnerAmount: z.string().max(40).optional(),
      }),
    )
    .max(30),
  deliveryFee: z.string().max(40).optional(),
  pickupFee: z.string().max(40).optional(),
  deliveryIncluded: z.boolean().optional(),
  pickupIncluded: z.boolean().optional(),
  paymentInitial: z.string().max(80).optional(),
  balanceDue: z.string().max(80).optional(),
  deposit: z.enum(["todo", "required", "not_required"]).optional(),
  billingValidated: z.boolean().optional(),
  validUntil: z.string().max(10).optional(),
});

export const parkCheckSchema = z.object({
  productId: z.string().min(8).max(64),
  note: z.string().max(500).optional(),
});

export const transmitProposalSchema = z.object({
  mode: z.enum(["email", "link"]),
  email: z.string().email().max(320).optional(),
  subject: z.string().min(3).max(200).optional(),
  message: z.string().min(8).max(4000).optional(),
});

export const followUpProposalSchema = z.object({
  dueDate: z.string().min(8).max(10),
  note: z.string().max(500).optional(),
});

export const recordAgreementSchema = z.object({
  channel: z.enum(["link", "email", "phone", "other"]).default("link"),
  note: z.string().max(2000).optional(),
  acceptedAt: z.string().max(40).optional(),
});

export const verifyPaymentSchema = z.object({
  amount: z.string().min(1).max(40),
  channel: z.enum(["bank_transfer", "mobile_money", "cash", "card", "other"]).default("bank_transfer"),
  bankReference: z.string().min(2).max(120).optional(),
  receivedAt: z.string().max(40).optional(),
  documentLabel: z.string().max(120).optional(),
  note: z.string().max(2000).optional(),
});

export const confirmRentalSchema = z.object({
  note: z.string().max(2000).optional(),
  recheckAvailability: z.boolean().optional(),
});

const logisticsStepSchema = z.object({
  id: z.string().min(1).max(40),
  kind: z.enum(["partner_collect", "depot", "client_delivery"]),
  label: z.string().max(200),
  place: z.string().max(200).optional(),
  address: z.string().max(400).optional(),
  contact: z.string().max(200).optional(),
  date: z.string().max(10).optional(),
  slotStart: z.string().max(8).optional(),
  slotEnd: z.string().max(8).optional(),
});

export const saveLogisticsPlanSchema = z.object({
  includeDepot: z.boolean().optional(),
  steps: z.array(logisticsStepSchema).max(8),
  transportMode: z.enum(["internal", "partner"]).optional(),
  driverLabel: z.string().max(120).optional(),
  vehicleLabel: z.string().max(120).optional(),
  handling: z.string().max(120).optional(),
  returnDate: z.string().max(10).optional(),
  returnSlot: z.string().max(80).optional(),
  note: z.string().max(2000).optional(),
  createMissions: z.boolean().optional(),
});

export const saveArticlePrepSchema = z.object({
  productId: z.string().min(8).max(64),
  identity: z.enum(["ok", "fix", "unchecked"]).optional(),
  cleaning: z.enum(["ok", "fix", "unchecked"]).optional(),
  functionTest: z.enum(["ok", "fix", "unchecked"]).optional(),
  accessories: z.enum(["ok", "fix", "unchecked"]).optional(),
  protection: z.enum(["ok", "fix", "unchecked"]).optional(),
  observation: z.string().max(2000).optional(),
  accessoryList: z
    .array(z.object({ label: z.string().max(120), present: z.boolean() }))
    .max(20)
    .optional(),
  declareReady: z.boolean().optional(),
});

export const recordPartnerCollectSchema = z.object({
  productId: z.string().min(8).max(64),
  functioning: z.enum(["ok", "fix", "unchecked"]).optional(),
  exterior: z.enum(["ok", "fix", "unchecked"]).optional(),
  accessories: z.enum(["ok", "fix", "unchecked"]).optional(),
  observation: z.string().max(2000).optional(),
  partnerConfirmName: z.string().max(120).optional(),
  collectorConfirmName: z.string().max(120).optional(),
  collectedAt: z.string().max(40).optional(),
  collectedTime: z.string().max(8).optional(),
});

export const authorizeDepartureSchema = z.object({
  balanceVerified: z.boolean().optional(),
  depositVerified: z.boolean().optional(),
  note: z.string().max(2000).optional(),
});

const arrivalItemSchema = z.object({
  productId: z.string().min(8).max(64),
  presentedQty: z.number().int().min(0).max(99),
  acceptedQty: z.number().int().min(0).max(99),
  status: z.enum(["accepted", "refused", "reserve"]),
  observation: z.string().max(2000).optional(),
});

export const saveArrivalControlSchema = z.object({
  arrivedTime: z.string().max(8).optional(),
  recipientName: z.string().max(160).optional(),
  recipientRole: z.string().max(120).optional(),
  recipientContact: z.string().max(120).optional(),
  identityChecked: z.boolean().optional(),
  quantitiesChecked: z.boolean().optional(),
  accessoriesChecked: z.boolean().optional(),
  stateCompared: z.boolean().optional(),
  instructionsGiven: z.boolean().optional(),
  functioning: z.enum(["not_tested", "ok", "fail"]).optional(),
  note: z.string().max(2000).optional(),
  items: z.array(arrivalItemSchema).max(40),
  readyForProof: z.boolean().optional(),
});

export const saveReceiptProofSchema = z.object({
  confirmMode: z.enum(["device", "link"]).optional(),
  recipientName: z.string().max(160).optional(),
  recipientRole: z.string().max(120).optional(),
  recipientConfirmed: z.boolean().optional(),
  recipientSigned: z.boolean().optional(),
  draft: z.boolean().optional(),
  recordHandover: z.boolean().optional(),
  note: z.string().max(2000).optional(),
});

export const saveRefusalSchema = z.object({
  productId: z.string().min(8).max(64),
  type: z.enum(["damage", "missing", "refusal", "other"]).optional(),
  description: z.string().max(2000).optional(),
  responsibility: z.enum(["to_determine", "transport", "partner", "client", "onloutou"]).optional(),
  nextDecision: z.enum(["replace", "redeliver", "adjust_proposal"]).optional(),
  assigneeLabel: z.string().max(120).optional(),
  preparePartialProof: z.boolean().optional(),
});

export const saveReturnPlanSchema = z.object({
  date: z.string().max(10).optional(),
  slotStart: z.string().max(8).optional(),
  slotEnd: z.string().max(8).optional(),
  address: z.string().max(400).optional(),
  contact: z.string().max(200).optional(),
  driverLabel: z.string().max(120).optional(),
  vehicleLabel: z.string().max(120).optional(),
  note: z.string().max(2000).optional(),
  createMission: z.boolean().optional(),
});

const returnPickupItemSchema = z.object({
  productId: z.string().min(8).max(64),
  qty: z.number().int().min(0).max(99),
  accessoriesOk: z.boolean().optional(),
  status: z.enum(["ok", "reserve", "missing"]),
  observation: z.string().max(2000).optional(),
});

export const saveReturnPickupSchema = z.object({
  arrivedTime: z.string().max(8).optional(),
  clientConfirmName: z.string().max(160).optional(),
  collectorConfirmName: z.string().max(160).optional(),
  note: z.string().max(2000).optional(),
  items: z.array(returnPickupItemSchema).max(40),
  recordPickup: z.boolean().optional(),
});

export const saveReturnDepotSchema = z.object({
  productId: z.string().min(8).max(64),
  identity: z.enum(["ok", "fail", "unchecked"]).optional(),
  accessories: z.enum(["ok", "fail", "unchecked"]).optional(),
  exterior: z.enum(["ok", "fail", "unchecked"]).optional(),
  cleaning: z.enum(["ok", "fail", "unchecked"]).optional(),
  functionTest: z.enum(["ok", "fail", "unchecked"]).optional(),
  observation: z.string().max(2000).optional(),
  validateCompliant: z.boolean().optional(),
});

export const savePartnerRestitutionSchema = z.object({
  productId: z.string().min(8).max(64),
  restitutedAt: z.string().max(40).optional(),
  restitutedTime: z.string().max(8).optional(),
  partnerConfirmName: z.string().max(160).optional(),
  transportConfirmName: z.string().max(160).optional(),
  note: z.string().max(2000).optional(),
  recordRestitution: z.boolean().optional(),
});

export const saveDepositDecisionSchema = z.object({
  kind: z.enum(["full", "partial", "retain"]).optional(),
  refundAmount: z.string().max(40).optional(),
  retainAmount: z.string().max(40).optional(),
  explanation: z.string().max(2000).optional(),
  channel: z.string().max(160).optional(),
  approverLabel: z.string().max(120).optional(),
  submit: z.boolean().optional(),
});

export const savePartnerPayoutSchema = z.object({
  amount: z.string().max(40).optional(),
  adjustments: z.string().max(200).optional(),
  deductions: z.string().max(200).optional(),
  beneficiary: z.string().max(160).optional(),
  channel: z.string().max(160).optional(),
  validatorLabel: z.string().max(120).optional(),
  preparedBy: z.string().max(120).optional(),
  note: z.string().max(2000).optional(),
  submit: z.boolean().optional(),
});

export const closeDossierSchema = z.object({
  closeDate: z.string().max(10).optional(),
  closeReason: z.string().max(200).optional(),
  closeNote: z.string().max(2000).optional(),
});

export type CreateContactRequestInput = z.infer<typeof createContactRequestSchema>;
export type CreateGenericRequestInput = z.infer<typeof createGenericRequestSchema>;
export type CreateAdminDossierInput = z.infer<typeof createAdminDossierSchema>;
export type SearchArticlesQuery = z.infer<typeof searchArticlesQuerySchema>;
export type SaveSelectionInput = z.infer<typeof saveSelectionSchema>;
export type CreatePartnerDemandInput = z.infer<typeof createPartnerDemandSchema>;
export type SaveProposalInput = z.infer<typeof saveProposalSchema>;
export type ParkCheckInput = z.infer<typeof parkCheckSchema>;
export type TransmitProposalInput = z.infer<typeof transmitProposalSchema>;
export type FollowUpProposalInput = z.infer<typeof followUpProposalSchema>;
export type RecordAgreementInput = z.infer<typeof recordAgreementSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type ConfirmRentalInput = z.infer<typeof confirmRentalSchema>;
export type SaveLogisticsPlanInput = z.infer<typeof saveLogisticsPlanSchema>;
export type SaveArticlePrepInput = z.infer<typeof saveArticlePrepSchema>;
export type RecordPartnerCollectInput = z.infer<typeof recordPartnerCollectSchema>;
export type AuthorizeDepartureInput = z.infer<typeof authorizeDepartureSchema>;
export type SaveArrivalControlInput = z.infer<typeof saveArrivalControlSchema>;
export type SaveReceiptProofInput = z.infer<typeof saveReceiptProofSchema>;
export type SaveRefusalInput = z.infer<typeof saveRefusalSchema>;
export type SaveReturnPlanInput = z.infer<typeof saveReturnPlanSchema>;
export type SaveReturnPickupInput = z.infer<typeof saveReturnPickupSchema>;
export type SaveReturnDepotInput = z.infer<typeof saveReturnDepotSchema>;
export type SavePartnerRestitutionInput = z.infer<typeof savePartnerRestitutionSchema>;
export type SaveDepositDecisionInput = z.infer<typeof saveDepositDecisionSchema>;
export type SavePartnerPayoutInput = z.infer<typeof savePartnerPayoutSchema>;
export type CloseDossierInput = z.infer<typeof closeDossierSchema>;

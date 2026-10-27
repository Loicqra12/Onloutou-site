export type EquipmentTransactionMode = "rental" | "sale" | "both";

export type EquipmentCategory = {
  slug: string;
  name: string;
  summary: string;
  transactionModes: EquipmentTransactionMode[];
  icon?: string;
  requestMessage: string;
};

import { equipmentHubMedia } from "@/content/equipment-page";

export function equipmentFamilyImage(imageKey: "mobility" | "generator" | "traceur") {
  return equipmentHubMedia[imageKey];
}

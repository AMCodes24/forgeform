const MATERIAL_COST_PER_GRAM: Record<string, number> = {
  pla: 0.03,
  petg: 0.035,
  abs: 0.032,
  resin: 0.05,
  tpu: 0.045,
};

export function formatPrintTime(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function estimateCostUsd(grams: number, material: string): number {
  const rate = MATERIAL_COST_PER_GRAM[material] ?? 0.03;
  return Math.round(grams * rate * 100) / 100;
}

export function materialLabel(material: string): string {
  const labels: Record<string, string> = {
    pla: "PLA",
    petg: "PETG",
    abs: "ABS",
    resin: "Resin",
    tpu: "TPU",
  };
  return labels[material] ?? material.toUpperCase();
}

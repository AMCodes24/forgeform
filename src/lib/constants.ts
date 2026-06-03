export const APP_NAME = "ForgeForm";
export const TAGLINE = "Turn Ideas Into Printable Reality";

export const STYLES = [
  "modern",
  "minimalist",
  "organic",
  "industrial",
  "playful",
  "geometric",
  "vintage",
  "futuristic",
] as const;

export const MATERIALS = [
  { value: "pla", label: "PLA" },
  { value: "petg", label: "PETG" },
  { value: "abs", label: "ABS" },
  { value: "resin", label: "Resin" },
  { value: "tpu", label: "TPU (Flexible)" },
] as const;

export const DETAIL_LEVELS = [
  { value: "low", label: "Low — Fast print" },
  { value: "medium", label: "Medium — Balanced" },
  { value: "high", label: "High — Fine detail" },
] as const;

export const INTENDED_USES = [
  "decorative",
  "functional",
  "prototype",
  "mechanical",
  "jewelry",
  "educational",
  "cosplay",
] as const;

export const EXAMPLE_PROMPTS = [
  "A dragon keychain with curled tail",
  "Ergonomic phone stand for desk",
  "Miniature cabin with pitched roof",
  "Custom gaming controller holder",
  "Geometric planter with drainage",
  "Cable organizer clip for desk edge",
];

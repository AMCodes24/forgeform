import type { GenerationParams, GeneratedModelData, ModelCategory } from "@/types";
import type { CategoryMatch } from "../detectCategory";
import { GENERATOR_VERSION } from "./shared";
import { buildDragonKeychain } from "./dragon-keychain";
import { buildPhoneStand } from "./phone-stand";
import { buildCabin } from "./cabin";
import { buildFurniture } from "./furniture";
import { buildKeychain } from "./keychain";
import { buildHolder } from "./holder";
import { buildPlanter } from "./planter";
import { buildGenericPlaceholder } from "./generic";

const CATEGORY_LABELS: Record<ModelCategory, string> = {
  "dragon-keychain": "Dragon Keychain",
  keychain: "Keychain Charm",
  "phone-stand": "Phone Stand",
  cabin: "Miniature Cabin",
  furniture: "Furniture",
  planter: "Planter",
  holder: "Device Holder",
  generic: "Custom Model",
  unclassified: "Placeholder Model",
};

export function generateProcedural(
  params: GenerationParams,
  match: CategoryMatch
): GeneratedModelData {
  let category = match.category;
  if (category === "unclassified") category = "generic";

  let primitives;
  let parametric: Record<string, number | string> = {};
  let isPlaceholder = false;

  switch (category) {
    case "dragon-keychain": {
      const r = buildDragonKeychain(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "phone-stand": {
      const r = buildPhoneStand(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "cabin": {
      const r = buildCabin(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "furniture": {
      const r = buildFurniture(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "keychain": {
      const r = buildKeychain(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "holder": {
      const r = buildHolder(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    case "planter": {
      const r = buildPlanter(params);
      primitives = r.primitives;
      parametric = r.parametric;
      break;
    }
    default: {
      const r = buildGenericPlaceholder(params);
      primitives = r.primitives;
      parametric = r.parametric;
      isPlaceholder = match.category === "unclassified";
      category = "generic";
      break;
    }
  }

  const width = params.width ?? 50;
  const height = params.height ?? 50;
  const depth = params.depth ?? 50;

  const name = isPlaceholder
    ? `[Placeholder] ${params.prompt.slice(0, 36)}`
    : `${CATEGORY_LABELS[category]} — ${params.prompt.slice(0, 28)}`;

  return {
    primitives,
    name: name.length > 48 ? name.slice(0, 48) + "…" : name,
    provider: "procedural",
    category,
    isPlaceholder,
    metadata: {
      prompt: params.prompt,
      style: params.style ?? "modern",
      material: params.material ?? "pla",
      dimensions: { width, height, depth },
      parametric,
      generatorVersion: GENERATOR_VERSION,
    },
  };
}

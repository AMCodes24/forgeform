import type { ModelCategory } from "@/types";

export interface CategoryMatch {
  category: ModelCategory;
  confidence: number;
  matchedKeywords: string[];
}

const RULES: { category: ModelCategory; keywords: string[]; weight?: number }[] = [
  {
    category: "dragon-keychain",
    keywords: ["dragon", "wyvern", "drake"],
    weight: 2,
  },
  {
    category: "keychain",
    keywords: ["keychain", "key ring", "keyring", "charm", "pendant"],
  },
  {
    category: "phone-stand",
    keywords: [
      "phone stand",
      "phone holder",
      "tablet stand",
      "device stand",
      "desk stand",
      "mobile stand",
    ],
  },
  {
    category: "cabin",
    keywords: [
      "cabin",
      "house",
      "cottage",
      "miniature home",
      "mini house",
      "building",
      "architecture",
    ],
  },
  {
    category: "furniture",
    keywords: [
      "table",
      "chair",
      "desk",
      "stool",
      "shelf",
      "bench",
      "furniture",
      "nightstand",
    ],
  },
  {
    category: "planter",
    keywords: ["planter", "pot", "vase", "flower pot"],
  },
  {
    category: "holder",
    keywords: [
      "holder",
      "organizer",
      "mount",
      "bracket",
      "controller",
      "headphone",
      "cup holder",
    ],
  },
];

export function detectCategory(prompt: string): CategoryMatch {
  const p = prompt.toLowerCase();

  let best: CategoryMatch = {
    category: "unclassified",
    confidence: 0,
    matchedKeywords: [],
  };

  for (const rule of RULES) {
    const matched = rule.keywords.filter((kw) => p.includes(kw));
    if (matched.length === 0) continue;

    const score = matched.length * (rule.weight ?? 1);
    if (score > best.confidence) {
      best = {
        category:
          rule.category === "dragon-keychain" && !p.includes("keychain") && !p.includes("charm")
            ? p.includes("dragon")
              ? "dragon-keychain"
              : rule.category
            : rule.category,
        confidence: score,
        matchedKeywords: matched,
      };
    }
  }

  // Dragon without keychain word still maps to dragon-keychain if keychain implied
  if (p.includes("dragon") && (p.includes("keychain") || p.includes("charm") || p.includes("ring"))) {
    best = {
      category: "dragon-keychain",
      confidence: Math.max(best.confidence, 3),
      matchedKeywords: ["dragon", "keychain"],
    };
  }

  if (best.confidence === 0) {
    return {
      category: "unclassified",
      confidence: 0,
      matchedKeywords: [],
    };
  }

  return best;
}

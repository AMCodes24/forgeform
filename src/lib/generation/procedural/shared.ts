import type { GenerationParams, ModelPrimitive } from "@/types";

export const GENERATOR_VERSION = "2.0.0";

const STYLE_COLORS: Record<string, string> = {
  modern: "#f97316",
  minimalist: "#94a3b8",
  organic: "#22c55e",
  industrial: "#64748b",
  playful: "#ec4899",
  geometric: "#8b5cf6",
  vintage: "#d97706",
  futuristic: "#06b6d4",
};

export interface ParametricDims {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  /** Scene units: 50mm ≈ 1.0 */
  unit: number;
  detail: "low" | "medium" | "high";
}

export function getParametricDims(params: GenerationParams): ParametricDims {
  const widthMm = params.width ?? 50;
  const heightMm = params.height ?? 50;
  const depthMm = params.depth ?? 50;
  const unit = widthMm / 50;
  const detail = params.detailLevel ?? "medium";
  return { widthMm, heightMm, depthMm, unit, detail };
}

export function styleColor(style?: string): string {
  return STYLE_COLORS[style ?? "modern"] ?? STYLE_COLORS.modern;
}

export function tint(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function mm(mmValue: number, dims: ParametricDims): number {
  return (mmValue / 50) * dims.unit;
}

export function prim(
  partial: ModelPrimitive & { minThicknessMm?: number }
): ModelPrimitive {
  return {
    metalness: 0.22,
    roughness: 0.58,
    minThicknessMm: 2,
    ...partial,
  };
}

export function basePlate(
  dims: ParametricDims,
  color: string,
  thicknessMm = 2
): ModelPrimitive {
  return prim({
    type: "box",
    position: [0, -dims.heightMm / 100, 0],
    rotation: [0, 0, 0],
    scale: [mm(dims.widthMm, dims), mm(thicknessMm, dims), mm(dims.depthMm, dims)],
    color: tint(color, -25),
    minThicknessMm: thicknessMm,
  });
}

export function keyringLoop(
  dims: ParametricDims,
  color: string,
  y: number,
  holeMm = 6
): ModelPrimitive {
  const r = mm(holeMm / 2, dims);
  return prim({
    type: "torus",
    position: [0, y, 0],
    rotation: [Math.PI / 2, 0, 0],
    scale: [r * 2.2, r * 0.35, r * 2.2],
    color: tint(color, -15),
    minThicknessMm: 2,
  });
}

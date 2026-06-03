import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, styleColor, tint } from "./shared";

/** Unclassified prompts — labeled placeholder with descriptive label plate */
export function buildGenericPlaceholder(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number | string>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const w = dims.widthMm;
  const h = dims.heightMm;
  const d = dims.depthMm;
  const minT = 2.5;

  const parts: ModelPrimitive[] = [
    prim({
      type: "box",
      position: [0, mm(h * 0.2, dims), 0],
      rotation: [0, 0.1, 0],
      scale: [mm(w * 0.6, dims), mm(h * 0.4, dims), mm(d * 0.6, dims)],
      color: tint(color, -10),
      minThicknessMm: minT,
    }),
    prim({
      type: "sphere",
      position: [0, mm(h * 0.45, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.2, dims), mm(w * 0.2, dims), mm(w * 0.2, dims)],
      color,
      minThicknessMm: minT,
    }),
    prim({
      type: "cylinder",
      position: [0, -mm(2, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.7, dims), mm(3, dims), mm(d * 0.7, dims)],
      color: tint(color, -35),
      minThicknessMm: minT,
    }),
    // "Label" block indicating placeholder
    prim({
      type: "box",
      position: [0, mm(h * 0.05, dims), mm(d * 0.35, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.5, dims), mm(4, dims), mm(2, dims)],
      color: "#fbbf24",
      minThicknessMm: minT,
    }),
  ];

  return {
    primitives: parts,
    parametric: {
      note: "placeholder",
      widthMm: w,
      heightMm: h,
      depthMm: d,
    },
  };
}

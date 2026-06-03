import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, styleColor, tint } from "./shared";

export function buildPlanter(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const w = dims.widthMm;
  const h = dims.heightMm;
  const wallT = Math.max(2.5, w * 0.08);

  const parts: ModelPrimitive[] = [
    prim({
      type: "cylinder",
      position: [0, mm(h * 0.25, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.45, dims), mm(h * 0.5, dims), mm(w * 0.45, dims)],
      color: tint(color, -15),
      minThicknessMm: wallT,
    }),
    prim({
      type: "cylinder",
      position: [0, mm(h * 0.48, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.5, dims), mm(wallT, dims), mm(w * 0.5, dims)],
      color,
      minThicknessMm: wallT,
    }),
    prim({
      type: "cylinder",
      position: [0, mm(2, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.42, dims), mm(wallT, dims), mm(w * 0.42, dims)],
      color: tint(color, -30),
      minThicknessMm: wallT,
    }),
  ];

  return {
    primitives: parts,
    parametric: { widthMm: w, heightMm: h, wallThicknessMm: wallT },
  };
}

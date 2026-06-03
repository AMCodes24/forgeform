import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, basePlate, styleColor, tint } from "./shared";

export function buildHolder(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const w = dims.widthMm;
  const h = dims.heightMm;
  const d = dims.depthMm;
  const minT = 3;

  const parts: ModelPrimitive[] = [
    basePlate(dims, tint(color, -25), minT),
    prim({
      type: "box",
      position: [0, mm(h * 0.35, dims), -mm(d * 0.2, dims)],
      rotation: [0.15, 0, 0],
      scale: [mm(w * 0.9, dims), mm(h * 0.65, dims), mm(minT, dims)],
      color,
      minThicknessMm: minT,
    }),
    prim({
      type: "box",
      position: [0, mm(h * 0.2, dims), mm(d * 0.25, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.75, dims), mm(h * 0.35, dims), mm(minT * 1.2, dims)],
      color: tint(color, 10),
      minThicknessMm: minT,
    }),
    prim({
      type: "cylinder",
      position: [0, mm(h * 0.55, dims), 0],
      rotation: [0, 0, Math.PI / 2],
      scale: [mm(w * 0.35, dims), mm(minT, dims), mm(w * 0.35, dims)],
      color: tint(color, -10),
      minThicknessMm: minT,
    }),
  ];

  return {
    primitives: parts,
    parametric: { widthMm: w, heightMm: h, depthMm: d },
  };
}

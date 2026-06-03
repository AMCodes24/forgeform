import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, styleColor, tint } from "./shared";

export function buildPhoneStand(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const w = dims.widthMm;
  const h = dims.heightMm;
  const d = dims.depthMm;
  const minT = 3;

  const baseH = Math.max(4, d * 0.12);
  const backAngle = 0.55; // ~32° lean

  const parts: ModelPrimitive[] = [
    prim({
      type: "box",
      position: [0, mm(baseH / 2, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w, dims), mm(baseH, dims), mm(d, dims)],
      color: tint(color, -20),
      minThicknessMm: minT,
    }),
    prim({
      type: "box",
      position: [0, mm(h * 0.35, dims), -mm(d * 0.15, dims)],
      rotation: [backAngle, 0, 0],
      scale: [mm(w * 0.92, dims), mm(h * 0.75, dims), mm(minT, dims)],
      color,
      minThicknessMm: minT,
    }),
    prim({
      type: "box",
      position: [0, mm(h * 0.12, dims), mm(d * 0.35, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.85, dims), mm(minT * 1.5, dims), mm(d * 0.25, dims)],
      color: tint(color, 10),
      minThicknessMm: minT,
    }),
    prim({
      type: "box",
      position: [0, mm(h * 0.25, dims), -mm(d * 0.05, dims)],
      rotation: [backAngle * 0.5, 0, 0],
      scale: [mm(w * 0.25, dims), mm(h * 0.5, dims), mm(minT, dims)],
      color: tint(color, -10),
      minThicknessMm: minT,
    }),
  ];

  return {
    primitives: parts,
    parametric: {
      widthMm: w,
      heightMm: h,
      depthMm: d,
      baseHeightMm: baseH,
      leanAngleRad: backAngle,
      minimumThicknessMm: minT,
    },
  };
}

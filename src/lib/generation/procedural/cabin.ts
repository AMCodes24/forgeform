import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, basePlate, styleColor, tint } from "./shared";

export function buildCabin(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const w = dims.widthMm;
  const h = dims.heightMm;
  const d = dims.depthMm;
  const minT = 2.5;
  const wallT = Math.max(2.5, w * 0.06);

  const parts: ModelPrimitive[] = [
    basePlate(dims, tint(color, -35), 2),
    // Walls
    prim({
      type: "box",
      position: [0, mm(h * 0.25, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w, dims), mm(h * 0.5, dims), mm(d, dims)],
      color: tint(color, -10),
      minThicknessMm: wallT,
    }),
    // Pitched roof
    prim({
      type: "box",
      position: [0, mm(h * 0.58, dims), 0],
      rotation: [0, 0, 0.38],
      scale: [mm(w * 1.05, dims), mm(wallT, dims), mm(d * 1.1, dims)],
      color,
      minThicknessMm: wallT,
    }),
    prim({
      type: "box",
      position: [0, mm(h * 0.58, dims), 0],
      rotation: [0, 0, -0.38],
      scale: [mm(w * 1.05, dims), mm(wallT, dims), mm(d * 1.1, dims)],
      color,
      minThicknessMm: wallT,
    }),
    // Door
    prim({
      type: "box",
      position: [0, mm(h * 0.12, dims), mm(d * 0.48, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.22, dims), mm(h * 0.28, dims), mm(2, dims)],
      color: tint(color, -40),
      minThicknessMm: minT,
    }),
    // Windows
    prim({
      type: "box",
      position: [-mm(w * 0.22, dims), mm(h * 0.3, dims), mm(d * 0.48, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.14, dims), mm(h * 0.12, dims), mm(2, dims)],
      color: tint(color, 30),
      minThicknessMm: minT,
    }),
    prim({
      type: "box",
      position: [mm(w * 0.22, dims), mm(h * 0.3, dims), mm(d * 0.48, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.14, dims), mm(h * 0.12, dims), mm(2, dims)],
      color: tint(color, 30),
      minThicknessMm: minT,
    }),
    // Chimney
    prim({
      type: "box",
      position: [mm(w * 0.25, dims), mm(h * 0.72, dims), mm(d * 0.15, dims)],
      rotation: [0, 0, 0],
      scale: [mm(w * 0.1, dims), mm(h * 0.18, dims), mm(w * 0.1, dims)],
      color: tint(color, -25),
      minThicknessMm: minT,
    }),
  ];

  return {
    primitives: parts,
    parametric: { widthMm: w, heightMm: h, depthMm: d, wallThicknessMm: wallT },
  };
}

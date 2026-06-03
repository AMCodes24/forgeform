import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, keyringLoop, styleColor, tint } from "./shared";

export function buildKeychain(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const size = Math.min(dims.widthMm, dims.depthMm);
  const minT = 2.5;
  const p = params.prompt.toLowerCase();

  const parts: ModelPrimitive[] = [
    keyringLoop(dims, color, mm(size * 0.45, dims), 6),
    prim({
      type: "box",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [mm(size * 0.7, dims), mm(minT, dims), mm(size * 0.5, dims)],
      color: tint(color, -15),
      minThicknessMm: minT,
    }),
  ];

  // Simple icon shape on charm
  if (p.includes("heart")) {
    parts.push(
      prim({
        type: "sphere",
        position: [-mm(size * 0.12, dims), mm(minT, dims), 0],
        rotation: [0, 0, 0],
        scale: [mm(8, dims), mm(8, dims), mm(8, dims)],
        color: tint(color, 20),
        minThicknessMm: minT,
      }),
      prim({
        type: "sphere",
        position: [mm(size * 0.12, dims), mm(minT, dims), 0],
        rotation: [0, 0, 0],
        scale: [mm(8, dims), mm(8, dims), mm(8, dims)],
        color: tint(color, 20),
        minThicknessMm: minT,
      }),
      prim({
        type: "cone",
        position: [0, -mm(size * 0.06, dims), 0],
        rotation: [Math.PI, 0, 0],
        scale: [mm(12, dims), mm(14, dims), mm(12, dims)],
        color: tint(color, 20),
        minThicknessMm: minT,
      })
    );
  } else {
    parts.push(
      prim({
        type: "cylinder",
        position: [0, mm(minT * 1.2, dims), 0],
        rotation: [0, 0, 0],
        scale: [mm(size * 0.25, dims), mm(minT, dims), mm(size * 0.25, dims)],
        color,
        minThicknessMm: minT,
      })
    );
  }

  return {
    primitives: parts,
    parametric: { charmSizeMm: size, keyringMm: 6, minimumThicknessMm: minT },
  };
}

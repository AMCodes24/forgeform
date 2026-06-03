import type { GenerationParams, ModelPrimitive } from "@/types";
import { getParametricDims, mm, prim, styleColor, tint } from "./shared";

export function buildFurniture(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const p = params.prompt.toLowerCase();
  const isChair = p.includes("chair") || p.includes("stool");
  const w = dims.widthMm;
  const h = dims.heightMm;
  const d = dims.depthMm;
  const legT = Math.max(2.5, w * 0.08);
  const legH = isChair ? h * 0.45 : h * 0.75;
  const topY = mm(legH, dims);

  const parts: ModelPrimitive[] = [];

  const legPositions: [number, number][] = [
    [-w * 0.38, -d * 0.38],
    [w * 0.38, -d * 0.38],
    [-w * 0.38, d * 0.38],
    [w * 0.38, d * 0.38],
  ];

  for (const [lx, lz] of legPositions) {
    parts.push(
      prim({
        type: "box",
        position: [mm(lx, dims), topY / 2, mm(lz, dims)],
        rotation: [0, 0, 0],
        scale: [mm(legT, dims), topY, mm(legT, dims)],
        color: tint(color, -20),
        minThicknessMm: legT,
      })
    );
  }

  // Top surface
  parts.push(
    prim({
      type: "box",
      position: [0, topY + mm(legT * 0.4, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(w, dims), mm(legT, dims), mm(d, dims)],
      color,
      minThicknessMm: legT,
    })
  );

  if (isChair) {
    parts.push(
      prim({
        type: "box",
        position: [0, topY + mm(h * 0.35, dims), -mm(d * 0.42, dims)],
        rotation: [0.08, 0, 0],
        scale: [mm(w * 0.9, dims), mm(h * 0.45, dims), mm(legT, dims)],
        color: tint(color, 8),
        minThicknessMm: legT,
      })
    );
  }

  return {
    primitives: parts,
    parametric: {
      widthMm: w,
      heightMm: h,
      depthMm: d,
      legThicknessMm: legT,
      type: isChair ? 1 : 0,
    },
  };
}

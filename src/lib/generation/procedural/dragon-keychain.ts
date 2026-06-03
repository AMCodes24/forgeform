import type { GenerationParams, ModelPrimitive } from "@/types";
import {
  getParametricDims,
  mm,
  prim,
  keyringLoop,
  styleColor,
  tint,
} from "./shared";

/** Parametric dragon keychain — flat charm layout for FDM printing */
export function buildDragonKeychain(params: GenerationParams): {
  primitives: ModelPrimitive[];
  parametric: Record<string, number>;
} {
  const dims = getParametricDims(params);
  const color = styleColor(params.style);
  const lengthMm = dims.widthMm;
  const tailDm = Math.max(3, lengthMm * 0.08);
  const keyringMm = 6;
  const minT = 2.5;

  const parametric = {
    lengthMm,
    tailDiameterMm: tailDm,
    keyringHoleMm: keyringMm,
    minimumThicknessMm: minT,
  };

  const parts: ModelPrimitive[] = [];

  // Attachment loop
  parts.push(keyringLoop(dims, color, mm(lengthMm * 0.42, dims), keyringMm));

  // Flat printable back plate (charm base)
  parts.push(
    prim({
      type: "box",
      position: [0, -mm(1, dims), 0],
      rotation: [0, 0, 0],
      scale: [mm(lengthMm * 0.85, dims), mm(minT, dims), mm(lengthMm * 0.55, dims)],
      color: tint(color, -30),
      minThicknessMm: minT,
    })
  );

  // Head + snout
  parts.push(
    prim({
      type: "sphere",
      position: [mm(lengthMm * 0.28, dims), mm(lengthMm * 0.08, dims), 0],
      rotation: [0, 0, 0],
      scale: [
        mm(lengthMm * 0.22, dims),
        mm(lengthMm * 0.18, dims),
        mm(lengthMm * 0.16, dims),
      ],
      color,
      minThicknessMm: minT,
    })
  );
  parts.push(
    prim({
      type: "cone",
      position: [mm(lengthMm * 0.38, dims), mm(lengthMm * 0.06, dims), 0],
      rotation: [0, 0, -Math.PI / 2],
      scale: [
        mm(lengthMm * 0.08, dims),
        mm(lengthMm * 0.14, dims),
        mm(lengthMm * 0.08, dims),
      ],
      color: tint(color, 10),
      minThicknessMm: minT,
    })
  );

  // Horns
  for (const side of [-1, 1]) {
    parts.push(
      prim({
        type: "cone",
        position: [
          mm(lengthMm * 0.26, dims),
          mm(lengthMm * 0.18, dims),
          side * mm(lengthMm * 0.08, dims),
        ],
        rotation: [0.3, 0, side * 0.4],
        scale: [
          mm(3, dims),
          mm(8, dims),
          mm(3, dims),
        ],
        color: tint(color, -10),
        minThicknessMm: minT,
      })
    );
  }

  // Body
  parts.push(
    prim({
      type: "box",
      position: [0, mm(lengthMm * 0.05, dims), 0],
      rotation: [0, 0.05, 0],
      scale: [
        mm(lengthMm * 0.45, dims),
        mm(lengthMm * 0.2, dims),
        mm(lengthMm * 0.35, dims),
      ],
      color: tint(color, -5),
      minThicknessMm: minT,
    })
  );

  // Wings
  for (const side of [-1, 1]) {
    parts.push(
      prim({
        type: "box",
        position: [
          -mm(lengthMm * 0.05, dims),
          mm(lengthMm * 0.12, dims),
          side * mm(lengthMm * 0.28, dims),
        ],
        rotation: [0.2, 0, side * 0.5],
        scale: [
          mm(lengthMm * 0.35, dims),
          mm(2.5, dims),
          mm(lengthMm * 0.22, dims),
        ],
        color: tint(color, 15),
        minThicknessMm: minT,
      })
    );
  }

  // Curled tail — arc of tapered segments
  const tailSegments = dims.detail === "high" ? 7 : dims.detail === "low" ? 4 : 5;
  for (let i = 0; i < tailSegments; i++) {
    const t = i / (tailSegments - 1);
    const angle = -Math.PI * 0.15 - t * Math.PI * 0.85;
    const radius = mm(lengthMm * 0.32, dims);
    parts.push(
      prim({
        type: "sphere",
        position: [
          Math.cos(angle) * radius - mm(lengthMm * 0.12, dims),
          mm(lengthMm * 0.02, dims) + Math.sin(angle) * radius * 0.35,
          Math.sin(angle) * radius * 0.25,
        ],
        rotation: [0, angle, 0],
        scale: [
          mm(tailDm * (1 - t * 0.35), dims),
          mm(tailDm * (1 - t * 0.35), dims),
          mm(tailDm * (1 - t * 0.35), dims),
        ],
        color: tint(color, Math.round(-5 + t * 15)),
        minThicknessMm: minT,
      })
    );
  }

  // Tail tip
  parts.push(
    prim({
      type: "cone",
      position: [
        -mm(lengthMm * 0.38, dims),
        -mm(lengthMm * 0.08, dims),
        mm(lengthMm * 0.12, dims),
      ],
      rotation: [0.4, 0.6, 0],
      scale: [mm(4, dims), mm(10, dims), mm(4, dims)],
      color: tint(color, 20),
      minThicknessMm: minT,
    })
  );

  // Back spikes
  const spikes = dims.detail === "high" ? 5 : 3;
  for (let i = 0; i < spikes; i++) {
    parts.push(
      prim({
        type: "cone",
        position: [
          -mm(lengthMm * (0.05 + i * 0.12), dims),
          mm(lengthMm * 0.14, dims),
          0,
        ],
        rotation: [0.2, 0, 0],
        scale: [mm(2.5, dims), mm(6, dims), mm(2.5, dims)],
        color: tint(color, -20),
        minThicknessMm: minT,
      })
    );
  }

  return { primitives: parts, parametric };
}
